import { Injectable } from '@nestjs/common';

type QueueTask<T> = {
  run: () => Promise<T>;
  resolve: (value: T) => void;
  reject: (error: unknown) => void;
};

@Injectable()
export class QueueDispatcherService {
  private readonly queue: QueueTask<unknown>[] = [];
  private running = false;

  enqueue<T>(run: () => Promise<T>): Promise<T> {
    return new Promise<T>((resolve, reject) => {
      this.queue.push({ run, resolve, reject });
      this.processQueue().catch(reject);
    });
  }

  private async processQueue() {
    if (this.running) {
      return;
    }

    this.running = true;

    while (this.queue.length > 0) {
      const task = this.queue.shift();

      if (!task) {
        continue;
      }

      try {
        const result = await task.run();
        task.resolve(result);
      } catch (error) {
        task.reject(error);
      }
    }

    this.running = false;
  }
}
