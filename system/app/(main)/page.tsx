import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function HomePage () { 
  const session = await auth(); 

  if(!session || !session?.user) redirect("/auth");

  return ( 
    <div>
      <h1> Home Page </h1>
      <p> Username: { session?.user?.name } </p>
    </div>
  )
}