import { signIn } from "@/auth"
 
export default function LoginPage() {
  return (
    <div className="flex h-screen w-full items-center justify-center bg-gray-100">
      <form
        action={async (formData) => {
          "use server"
          await signIn("credentials", formData)
        }}
        className="flex w-full max-w-sm flex-col gap-4 rounded-lg border bg-white p-8 shadow-lg"
      >
        <h1 className="text-2xl font-bold text-center">Admin Login</h1>
        
        <label className="flex flex-col gap-2">
          <span className="text-sm font-medium">Email</span>
          <input
            name="email"
            type="email"
            placeholder="admin@krazycoders.com"
            className="rounded border p-2"
            required
          />
        </label>
 
        <label className="flex flex-col gap-2">
          <span className="text-sm font-medium">Password</span>
          <input
            name="password"
            type="password"
            placeholder="password123"
            className="rounded border p-2"
            required
          />
        </label>
 
        <button className="rounded bg-black p-2 text-white hover:bg-gray-800">
          Sign In
        </button>
      </form>
    </div>
  )
}