import type { User } from "@clerk/nextjs/dist/api";

export const filterUserForCliente = (user: User) => {
  return {  
    id: user.id, 
    username: user.username, 
    profileImageUrl: user.profileImageUrl
  }
}