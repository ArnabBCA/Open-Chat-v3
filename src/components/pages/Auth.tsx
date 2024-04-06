const Auth = () => {
  return (
    <div className="bg-accent flex h-svh items-center justify-center p-4">
      <div className="flex w-full max-w-md flex-col gap-5 rounded-md bg-left p-4 shadow-2xl">
        <h3 className="text-center text-2xl text-inputText font-extrabold">Sign Up</h3>
        <form action="" className="flex flex-col gap-5">
          <input
            type="text"
            placeholder="Email"
            className="rounded-md bg-input px-4 py-2 text-inputText outline-none "
          />
          <input
            type="text"
            placeholder="Display Name"
            className="rounded-md bg-input px-4 py-2 text-inputText outline-none"
          />
          <input
            type="text"
            placeholder="Password"
            className="rounded-md bg-input px-4 py-2 text-inputText outline-none"
          />
          <input
            type="text"
            placeholder="Confirm Password"
            className="rounded-md bg-input px-4 py-2 text-inputText outline-none"
          />
          <div className="flex flex-col">
            <button className="bg-accent rounded-md px-4 py-2 text-white outline-none">
              Create Account
            </button>
            <span className="text-neutral-500 text-center p-1">or</span>
            <button className="rounded-md bg-white px-4 py-2 text-black outline-none">
              Continue with Google
            </button>
          </div>
        </form>
        <p className="text-neutral-500 text-sm">Already have an account? <span className="text-accent underline">Login</span></p>
      </div>
    </div>
  );
};

export default Auth;
