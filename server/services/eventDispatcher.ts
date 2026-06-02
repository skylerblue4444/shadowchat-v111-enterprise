/**
 * Enterprise Event Dispatcher
 * Decouples system-wide logic through asynchronous event handling.
 */
type EventHandler = (data: any) => void | Promise<void>;

export class EventDispatcher {
  private static handlers = new Map<string, EventHandler[]>();

  static on(event: string, handler: EventHandler) {
    const current = this.handlers.get(event) || [];
    this.handlers.set(event, [...current, handler]);
  }

  static async emit(event: string, data: any) {
    console.log(`[Event] ${event} emitted`, data);
    const handlers = this.handlers.get(event) || [];
    
    // Process handlers asynchronously to avoid blocking
    handlers.forEach(handler => {
      try {
        const result = handler(data);
        if (result instanceof Promise) {
          result.catch(err => console.error(`[Event] Error in handler for ${event}:`, err));
        }
      } catch (err) {
        console.error(`[Event] Error in handler for ${event}:`, err);
      }
    });
  }
}

// Initialize system-wide event listeners
EventDispatcher.on("USER_LOGIN", (data) => {
  console.log(`[Event] Tracking login for user ${data.userId}`);
});

EventDispatcher.on("TRADE_EXECUTED", (data) => {
  console.log(`[Event] Updating market analytics for trade ${data.tradeId}`);
});
