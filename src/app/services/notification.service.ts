import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface Notification {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info' | 'warning';
  timestamp: Date;
  autoClose?: boolean;
}

@Injectable({ providedIn: 'root' })
export class NotificationService {
  private notificationsSubject = new BehaviorSubject<Notification[]>([]);
  notifications$: Observable<Notification[]> = this.notificationsSubject.asObservable();

  constructor() {}

  /**
   * Add a new notification
   */
  addNotification(notification: Omit<Notification, 'id' | 'timestamp'>): string {
    const id = this.generateId();
    const newNotification: Notification = {
      ...notification,
      id,
      timestamp: new Date(),
      autoClose: notification.autoClose ?? true
    };

    const currentNotifications = this.notificationsSubject.getValue();
    this.notificationsSubject.next([...currentNotifications, newNotification]);

    // Auto-close notification after 5 seconds if autoClose is true
    if (newNotification.autoClose) {
      setTimeout(() => {
        this.removeNotification(id);
      }, 5000);
    }

    return id;
  }

  /**
   * Remove a notification by ID
   */
  removeNotification(id: string): void {
    const currentNotifications = this.notificationsSubject.getValue();
    this.notificationsSubject.next(
      currentNotifications.filter(notification => notification.id !== id)
    );
  }

  /**
   * Clear all notifications
   */
  clearNotifications(): void {
    this.notificationsSubject.next([]);
  }

  /**
   * Helper methods for common notification types
   */
  success(message: string, autoClose = true): string {
    return this.addNotification({ message, type: 'success', autoClose });
  }

  error(message: string, autoClose = true): string {
    return this.addNotification({ message, type: 'error', autoClose });
  }

  info(message: string, autoClose = true): string {
    return this.addNotification({ message, type: 'info', autoClose });
  }

  warning(message: string, autoClose = true): string {
    return this.addNotification({ message, type: 'warning', autoClose });
  }

  private generateId(): string {
    return Math.random().toString(36).substring(2, 11);
  }
}