import { UserActions } from '@/modules/user/user.interface';
import { verifySession } from './session';
import { redirect } from 'next/navigation';

export async function getUser() {
    const userController = UserActions.default;
    const verifiedSession = await verifySession();
    const user = await userController.getUserById(verifiedSession?.userId);
    if(!user.success) redirect('/auth/logout');
    return user;
}

export async function verifyRole(requiredRole: string) {
    const user = await getUser();
    const userData = user?.data as { role?: string } | null;
    if (!userData?.role || userData.role !== requiredRole) {
        return redirect('/dashboard');
    }
    return userData;
}