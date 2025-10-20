import React from 'react';

// This footer is now fixed to the bottom of the screen
export default function Footer() {
    return (
        <footer className="fixed bottom-0 left-0 right-0 bg-gray-800 text-gray-400 py-3 z-50">
            <div className="container mx-auto px-4 relative flex flex-col sm:flex-row justify-center items-center text-sm">
                
                {/* Copyright Notice - Always Centered */}
                <div className="text-center">
                    <p>&copy; 2025 Muadz Khalid. Thanks for stopping by!😌</p>
                </div>
                
                {/* Social & Contact Links - Positioned to the side on larger screens */}
                <div className="flex items-center gap-4 mt-2 sm:mt-0 sm:absolute sm:right-4">
                    <a 
                        href="https://www.linkedin.com/in/muadzkhalid" 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="hover:text-blue-400 transition-colors"
                        aria-label="LinkedIn Profile"
                    >
                        {/* LinkedIn SVG Icon */}
                        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                            <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                        </svg>
                    </a>
                    <a 
                        href="mailto:muadzkhalid6@gmail.com" 
                        className="hover:text-blue-400 transition-colors"
                        aria-label="Email"
                    >
                        {/* Email SVG Icon */}
                        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                            <path d="M22 6c0-1.1-.9-2-2-2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6zm-2 0l-8 5-8-5h16zm0 12H4V8l8 5 8-5v10z"/>
                        </svg>
                    </a>
                </div>

            </div>
        </footer>
    );
}