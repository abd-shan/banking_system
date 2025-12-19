import Link from 'next/link';

export default function WelcomePage() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 flex flex-col items-center justify-center p-6 relative overflow-hidden">

            {/* Background Decorative Elements (Optional for aesthetics) */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none opacity-30">
                <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob"></div>
                <div className="absolute top-[-10%] right-[-10%] w-96 h-96 bg-indigo-200 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-2000"></div>
            </div>

            <div className="z-10 max-w-4xl w-full flex flex-col items-center text-center">

                {/* Badge */}
                <span className="mb-6 px-4 py-1.5 rounded-full bg-blue-100 text-blue-700 text-sm font-semibold tracking-wide uppercase border border-blue-200 shadow-sm">
                  Secure Banking Platform
                </span>

                {/* Main Headline */}
                <h2 className="text-5xl md:text-7xl font-extrabold text-slate-900 mb-6 tracking-tight leading-tight">
                    Welcome to <br className="hidden md:block" />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
                      Bank Management System
                    </span>
                </h2>

                {/* Subtitle */}
                <p className="text-lg md:text-xl text-slate-600 mb-10 max-w-2xl leading-relaxed">
                    Your secure and efficient platform for managing all banking operations.
                    Built with Next.js for speed and leveraging the
                    <span className="font-semibold text-slate-800"> Facade Pattern </span>
                    for architectural excellence.
                </p>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto justify-center mb-16">
                    <Link
                        href="/login"
                        className="group flex items-center justify-center gap-2 px-8 py-4 text-lg font-bold text-white bg-blue-600 rounded-xl hover:bg-blue-700 hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
                    >
                        <span>Get Started</span>
                        {/* Arrow Icon */}
                        <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6"></path></svg>
                    </Link>

                    <Link
                        href="/dashboard"
                        className="flex items-center justify-center gap-2 px-8 py-4 text-lg font-bold text-slate-700 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 hover:border-blue-300 hover:text-blue-600 hover:shadow-md transition-all duration-300"
                    >
                        {/* Dashboard Icon */}
                        <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"></path></svg>
                        <span>View Dashboard</span>
                    </Link>
                </div>

                {/* Tech Stack Card */}
                <div className="w-full max-w-3xl bg-white/80 backdrop-blur-sm border-l-4 border-blue-500 rounded-lg shadow-lg p-6 text-left transform transition hover:scale-[1.01] duration-300">
                    <div className="flex items-start gap-4">
                        <div className="p-3 bg-blue-100 rounded-lg shrink-0">
                            {/* Code Icon */}
                            <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"></path></svg>
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-slate-800 mb-2">Architectural Highlight: Facade Pattern</h2>
                            <p className="text-slate-600 leading-relaxed">
                                All interactions with the NestJS backend are channeled through a single <code className="bg-slate-100 px-2 py-0.5 rounded text-blue-600 font-mono text-sm">BankFacade</code>. This ensures UI components remain decoupled from the complex API layer, promoting clarity and ease of maintenance.
                            </p>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}