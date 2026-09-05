import { io, Socket } from 'socket.io-client';
import { toast } from 'sonner';
import { soundEngine } from './soundEngine';

type MessageHandler = (data: any) => void;
type ConversationUpdateHandler = (data: any) => void;

class SocketService {
  private socket: Socket | null = null;
  private currentWorkspaceId: number | null = null;
  private messageHandlers: Set<MessageHandler> = new Set();
  private updateHandlers: Set<ConversationUpdateHandler> = new Set();
  private isConnecting: boolean = false;

  public init(serverUrl?: string) {
    if (this.socket || this.isConnecting) return;
    this.isConnecting = true;

    const defaultUrl = import.meta.env.VITE_WS_URL 
      || (typeof window !== 'undefined' && window.location.port === '5173' ? 'http://localhost:3000' : (typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000'));
    const url = serverUrl || defaultUrl;

    try {
      this.socket = io(url, {
        autoConnect: true,
        reconnection: true,
        reconnectionAttempts: 5,
        reconnectionDelay: 2000,
        transports: ['websocket', 'polling'],
        timeout: 5000,
      });

      this.socket.on('connect', () => {
        console.log('[Rudood WebSocket] Connected to real-time engine:', this.socket?.id);
        this.isConnecting = false;
        if (this.currentWorkspaceId) {
          this.joinWorkspace(this.currentWorkspaceId);
        }
      });

      this.socket.on('connect_error', () => {
        // Suppress noisy logs when WebSocket server is not running
        this.isConnecting = false;
      });

      // Handle real-time incoming messages
      this.socket.on('new_message', (data) => {
        console.log('[Rudood WebSocket] new_message received:', data);

        // Acoustic feedback
        soundEngine.playReceived();

        // Notification popup for customer messages
        if (data.sender_type === 'customer') {
          toast.info(`رسالة جديدة من ${data.sender_name || 'عميل'}`, {
            description: data.content || 'رسالة جديدة واردة في المحادثات',
            duration: 4000,
          });
        }

        // Notify subscribers
        this.messageHandlers.forEach((handler) => handler(data));
      });

      // Handle sidebar / conversation list updates
      this.socket.on('conversation_updated', (data) => {
        this.updateHandlers.forEach((handler) => handler(data));
      });
    } catch (e) {
      console.warn('[Rudood WebSocket] Initialization failed, continuing in HTTP mode.');
      this.isConnecting = false;
    }
  }

  public joinWorkspace(workspaceId: number) {
    this.currentWorkspaceId = workspaceId;
    if (this.socket && this.socket.connected) {
      this.socket.emit('join_workspace', workspaceId);
      console.log(`[Rudood WebSocket] Joined workspace room: workspace_${workspaceId}`);
    }
  }

  public joinConversation(conversationId: number) {
    if (this.socket && this.socket.connected) {
      this.socket.emit('join_conversation', conversationId);
    }
  }

  public onNewMessage(handler: MessageHandler): () => void {
    this.messageHandlers.add(handler);
    return () => {
      this.messageHandlers.delete(handler);
    };
  }

  public onConversationUpdated(handler: ConversationUpdateHandler): () => void {
    this.updateHandlers.add(handler);
    return () => {
      this.updateHandlers.delete(handler);
    };
  }

  public disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
    this.currentWorkspaceId = null;
    this.isConnecting = false;
  }
}

export const socketService = new SocketService();
