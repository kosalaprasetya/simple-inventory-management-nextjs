import { verifyRole } from '@/lib/dataAccess'
async function UsersPage() {
  await verifyRole('admin');
  return (
    <div>UsersPage</div>
  )
}

export default UsersPage