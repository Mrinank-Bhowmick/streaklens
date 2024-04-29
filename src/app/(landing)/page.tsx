import Link from 'next/link'
import React from 'react'

const page = () => {
  return (
    <>
    <div>
      Landing page
    </div>
    <Link href={"/sign-in"}>
    <button>Login</button>
    </Link>

    <Link href={"/sign-up"}>
    <button>Register</button>
    </Link>
    </>
  )
}

export default page
