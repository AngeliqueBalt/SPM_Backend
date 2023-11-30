import { Session } from './models/Session';
import { User } from './models/User';

declare module '@apollosoftwarexyz/cinnamon' {
    interface Context {
        session?: Session;
        user?: User;
    }
}
