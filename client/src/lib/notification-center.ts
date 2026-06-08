/**
 * ShadowChat v1111 - Global Notifications & Activity Center
 * Real-time notifications, Activity Feed, Event Tracking
 */

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: "info" | "success" | "warning" | "error" | "achievement" | "transaction" | "social";
  priority: "low" | "medium" | "high" | "urgent";
  status: "unread" | "read" | "archived";
  timestamp: Date;
  link?: string;
  metadata?: any;
}

export interface Activity {
  id: string;
  userId: string;
  action: string;
  target: string;
  type: string;
  timestamp: Date;
  metadata?: any;
}

export interface NotificationSettings {
  userId: string;
  emailEnabled: boolean;
  pushEnabled: boolean;
  categories: {
    economic: boolean;
    social: boolean;
    technical: boolean;
    governance: boolean;
    achievements: boolean;
  };
}

// Notification Center
export class NotificationCenter {
  private notifications: Map<string, Notification[]> = new Map();
  private activities: Activity[] = [];
  private settings: Map<string, NotificationSettings> = new Map();

  /**
   * Send notification to user
   */
  sendNotification(
    userId: string,
    title: string,
    message: string,
    type: Notification["type"],
    priority: Notification["priority"] = "medium",
    link?: string
  ): Notification {
    const notification: Notification = {
      id: `notif-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      userId,
      title,
      message,
      type,
      priority,
      status: "unread",
      timestamp: new Date(),
      link,
    };

    if (!this.notifications.has(userId)) {
      this.notifications.set(userId, []);
    }

    this.notifications.get(userId)!.unshift(notification);
    this.recordActivity(userId, "received_notification", notification.id, "system");

    return notification;
  }

  /**
   * Broadcast notification to all users
   */
  broadcastNotification(title: string, message: string, type: Notification["type"]): void {
    this.notifications.forEach((_, userId) => {
      this.sendNotification(userId, title, message, type, "medium");
    });
  }

  /**
   * Record user activity
   */
  recordActivity(userId: string, action: string, target: string, type: string, metadata?: any): Activity {
    const activity: Activity = {
      id: `act-${Date.now()}`,
      userId,
      action,
      target,
      type,
      timestamp: new Date(),
      metadata,
    };

    this.activities.unshift(activity);
    return activity;
  }

  /**
   * Get user notifications
   */
  getNotifications(userId: string, status?: Notification["status"]): Notification[] {
    const userNotifs = this.notifications.get(userId) || [];
    return status ? userNotifs.filter((n) => n.status === status) : userNotifs;
  }

  /**
   * Mark notification as read
   */
  markAsRead(userId: string, notificationId: string): void {
    const userNotifs = this.notifications.get(userId) || [];
    const notif = userNotifs.find((n) => n.id === notificationId);
    if (notif) {
      notif.status = "read";
    }
  }

  /**
   * Mark all as read
   */
  markAllAsRead(userId: string): void {
    const userNotifs = this.notifications.get(userId) || [];
    userNotifs.forEach((n) => (n.status = "read"));
  }

  /**
   * Get user activity feed
   */
  getUserActivity(userId: string, limit: number = 20): Activity[] {
    return this.activities.filter((a) => a.userId === userId).slice(0, limit);
  }

  /**
   * Get global activity feed
   */
  getGlobalActivity(limit: number = 50): Activity[] {
    return this.activities.slice(0, limit);
  }

  /**
   * Update notification settings
   */
  updateSettings(userId: string, newSettings: Partial<NotificationSettings>): NotificationSettings {
    const current = this.settings.get(userId) || {
      userId,
      emailEnabled: true,
      pushEnabled: true,
      categories: {
        economic: true,
        social: true,
        technical: true,
        governance: true,
        achievements: true,
      },
    };

    const updated = { ...current, ...newSettings };
    this.settings.set(userId, updated);
    return updated;
  }

  /**
   * Get notification stats
   */
  getStats(userId: string) {
    const userNotifs = this.notifications.get(userId) || [];
    return {
      total: userNotifs.length,
      unread: userNotifs.filter((n) => n.status === "unread").length,
      read: userNotifs.filter((n) => n.status === "read").length,
      archived: userNotifs.filter((n) => n.status === "archived").length,
    };
  }
}

// Singleton instance
export const notificationCenter = new NotificationCenter();
