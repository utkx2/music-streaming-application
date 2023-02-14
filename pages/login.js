import { getProviders, signIn } from 'next-auth/react';

export default function Login({ providers }) {
    return (
        <div className='flex flex-col items-center bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 ... min-h-screen w-full justify-center'>
            <img src="https://www.freeiconspng.com/uploads/trollface-png-15.png" className='w-52 m-10' alt="icon" />

            {
                Object.values(providers).map((provider) => (
                    <div key={provider.name}>
                        <button className='bg-black text-white p-5 rounded-full w-64' onClick={() => signIn(provider.id, { callbackUrl: "/" })}>
                            Login with {provider.name}
                        </button>
                    </div>
                ))
            }
        </div>
    );
};

export async function getServerSideProps() {
    const providers = await getProviders();
    return {
        props: {
            providers
        }
    }
}

