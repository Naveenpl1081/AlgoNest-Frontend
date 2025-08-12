import React from 'react';
import { Search, Users, Calendar, Trophy, ArrowRight, User, Crown } from 'lucide-react';

const RecruiterPortal = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
     
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-purple-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-3/4 left-1/2 w-64 h-64 bg-pink-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>

     
      <nav className="relative z-10 bg-slate-800/80 backdrop-blur-md border-b border-slate-700/50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            AlgoNest
          </div>

          <div className="flex items-center space-x-8">
            <a href="#" className="text-white font-medium">HOME</a>
            <a href="#" className="text-gray-300 hover:text-white transition-colors">Jobs</a>
            <a href="#" className="text-gray-300 hover:text-white transition-colors">Interview</a>
          </div>

          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center">
              <User className="w-4 h-4" />
            </div>
            <div className="flex items-center space-x-1">
              <Crown className="w-4 h-4 text-yellow-400" />
              <span className="text-yellow-400 font-medium text-sm">Premium</span>
            </div>
          </div>
        </div>
      </nav>

      
      <div className="relative z-10 max-w-7xl mx-auto px-6 py-12">
        <div className="grid lg:grid-cols-2 gap-12 items-start">
      
          <div>
            <h1 className="text-5xl lg:text-6xl font-bold mb-6 leading-tight">
              <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                Revolutionize Your Tech
              </span>
              <br />
              <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                Recruitment with
              </span>
              <br />
              <span className="bg-gradient-to-r from-pink-400 to-blue-400 bg-clip-text text-transparent">
                AlgoNest
              </span>
            </h1>

            <p className="text-xl text-gray-300 mb-12 leading-relaxed max-w-lg">
              Find the perfect candidate for your tech roles faster and smarter 
              with our intuitive recruitment platform.
            </p>
          </div>

         
          <div className="relative">
            <div className="bg-gradient-to-br from-slate-700/30 to-slate-600/20 backdrop-blur-md rounded-3xl p-8 border border-slate-600/50">
              <div className="relative h-64 flex items-center justify-center">
                
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="relative">
                  
                    <div className="w-24 h-24 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center shadow-lg">
                      <Search className="w-12 h-12 text-white" />
                    </div>
                    
                   
                    <div className="absolute -top-8 -left-8 w-12 h-12 bg-gradient-to-r from-blue-400 to-cyan-400 rounded-full flex items-center justify-center">
                      <User className="w-6 h-6 text-white" />
                    </div>
                    <div className="absolute -top-8 -right-8 w-12 h-12 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full flex items-center justify-center">
                      <User className="w-6 h-6 text-white" />
                    </div>
                    <div className="absolute -bottom-8 -left-8 w-12 h-12 bg-gradient-to-r from-pink-400 to-purple-400 rounded-full flex items-center justify-center">
                      <User className="w-6 h-6 text-white" />
                    </div>
                    <div className="absolute -bottom-8 -right-8 w-12 h-12 bg-gradient-to-r from-cyan-400 to-blue-400 rounded-full flex items-center justify-center">
                      <User className="w-6 h-6 text-white" />
                    </div>
                    <div className="absolute top-12 -left-16 w-10 h-10 bg-gradient-to-r from-blue-300 to-purple-300 rounded-full flex items-center justify-center opacity-70">
                      <User className="w-5 h-5 text-white" />
                    </div>
                    <div className="absolute top-12 -right-16 w-10 h-10 bg-gradient-to-r from-purple-300 to-pink-300 rounded-full flex items-center justify-center opacity-70">
                      <User className="w-5 h-5 text-white" />
                    </div>
                  </div>
                </div>
                
            
                <div className="absolute top-4 right-4 w-8 h-8 bg-blue-500/20 rounded-lg rotate-12"></div>
                <div className="absolute bottom-4 left-4 w-6 h-6 bg-purple-500/20 rounded-full"></div>
                <div className="absolute top-8 left-8 w-4 h-4 bg-pink-500/20 rounded-full animate-pulse"></div>
              </div>
            </div>
          </div>
        </div>

     
        <div className="grid lg:grid-cols-2 gap-8 mt-16">
         
          <div className="bg-gradient-to-br from-slate-700/30 to-slate-600/20 backdrop-blur-md rounded-3xl p-8 border border-slate-600/50 group hover:scale-105 transition-all duration-300">
            <div className="relative h-48 mb-6 flex items-center justify-center">
             
              <div className="relative">
                <div className="w-20 h-20 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center shadow-lg">
                  <Users className="w-10 h-10 text-white" />
                </div>
                
                
                <div className="absolute -top-6 -left-12 w-16 h-20 bg-gradient-to-br from-blue-100 to-blue-50 rounded-lg shadow-md flex flex-col items-center justify-center transform rotate-12">
                  <div className="w-8 h-8 bg-blue-400 rounded-full mb-1"></div>
                  <div className="w-10 h-1 bg-gray-300 rounded"></div>
                  <div className="w-8 h-1 bg-gray-300 rounded mt-1"></div>
                </div>
                
                <div className="absolute -top-6 -right-12 w-16 h-20 bg-gradient-to-br from-purple-100 to-purple-50 rounded-lg shadow-md flex flex-col items-center justify-center transform -rotate-12">
                  <div className="w-8 h-8 bg-purple-400 rounded-full mb-1"></div>
                  <div className="w-10 h-1 bg-gray-300 rounded"></div>
                  <div className="w-8 h-1 bg-gray-300 rounded mt-1"></div>
                </div>
                
              
                <div className="absolute -bottom-4 -left-8 w-6 h-6 bg-blue-500/20 rounded-full animate-bounce" style={{ animationDelay: '0.5s' }}></div>
                <div className="absolute -bottom-4 -right-8 w-4 h-4 bg-purple-500/20 rounded-lg animate-bounce" style={{ animationDelay: '1s' }}></div>
              </div>
            </div>
            
            <h3 className="text-2xl font-bold mb-4 text-white">
              Hire the Best Tech Talent with Our Comprehensive Recruitment Platform
            </h3>
            
            <button className="flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl font-semibold hover:from-blue-500 hover:to-purple-500 transition-all duration-200 group-hover:scale-105">
              Post a Job
              <ArrowRight className="ml-2 w-5 h-5" />
            </button>
          </div>

     
          <div className="bg-gradient-to-br from-slate-700/30 to-slate-600/20 backdrop-blur-md rounded-3xl p-8 border border-slate-600/50 group hover:scale-105 transition-all duration-300">
            <div className="relative h-48 mb-6 flex items-center justify-center">
           
              <div className="relative">
                <div className="w-20 h-20 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full flex items-center justify-center shadow-lg">
                  <Calendar className="w-10 h-10 text-white" />
                </div>
                
             
                <div className="absolute -top-8 -left-16 w-24 h-16 bg-gradient-to-br from-purple-100 to-pink-50 rounded-lg shadow-md p-2">
                  <div className="flex space-x-1 mb-2">
                    <div className="w-2 h-2 bg-red-400 rounded-full"></div>
                    <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                    <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                  </div>
                  <div className="flex space-x-2">
                    <div className="w-6 h-6 bg-blue-400 rounded-full"></div>
                    <div className="w-6 h-6 bg-purple-400 rounded-full"></div>
                    <div className="w-6 h-6 bg-pink-400 rounded-full"></div>
                  </div>
                </div>
                
           
                <div className="absolute -bottom-8 -right-16 w-20 h-12 bg-gradient-to-br from-pink-100 to-purple-50 rounded-lg shadow-md flex items-center justify-center">
                  <Trophy className="w-6 h-6 text-yellow-500" />
                </div>
                
             
                <div className="absolute top-4 right-8 w-3 h-3 bg-purple-500/30 rounded-full animate-pulse"></div>
                <div className="absolute bottom-4 left-8 w-2 h-2 bg-pink-500/30 rounded-full animate-pulse" style={{ animationDelay: '0.5s' }}></div>
              </div>
            </div>
            
            <h3 className="text-2xl font-bold mb-4 text-white">
              Streamline Your Technical Interviews and Select the Top Talent with Ease
            </h3>
            
            <button className="flex items-center px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl font-semibold hover:from-purple-500 hover:to-pink-500 transition-all duration-200 group-hover:scale-105">
              Interview
              <ArrowRight className="ml-2 w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      
      <footer className="relative z-10 mt-20 border-t border-slate-700/50">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mb-2">
                AlgoNest
              </div>
              <p className="text-sm text-gray-400">Unlock the Riddles of Programming</p>
            </div>
            <div className="text-center">
              <div className="w-px h-12 bg-slate-600 mx-auto mb-4"></div>
              <p className="text-sm text-gray-400">Copyrights reserved</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default RecruiterPortal;