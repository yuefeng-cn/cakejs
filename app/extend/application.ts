import { Application } from "egg";

export default {
  get appName() {
    const app = this as Application;
    return app.config.appName ?? 'CAKE';
  },
};
