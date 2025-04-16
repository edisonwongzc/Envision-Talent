'use client';

import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CalendarIcon, MoreIcon } from "@/components/icons";

/**
 * 人才履历详细页面
 * @returns {React.ReactElement} 人才履历详细信息组件
 */
export default function ProfileDetail() {
  return (
    <div className="h-full p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button className="p-2 border rounded-full">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
          </button>
          <button className="p-2 border rounded-full">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </button>
          <span className="text-sm text-gray-500">1 out of 56</span>
        </div>
        <button className="p-2">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
      </div>

      <div className="grid grid-cols-12 gap-6">
        {/* 左侧内容区 */}
        <div className="col-span-8 space-y-6">
          <Card className="shadow-sm">
            <CardContent className="p-0">
              <div className="flex p-6 items-start">
                <div className="mr-4">
                  <div className="w-16 h-16 rounded-full overflow-hidden bg-gray-200">
                    <img src="/avatar.png" alt="候选人头像" className="w-full h-full object-cover" />
                  </div>
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <h1 className="text-xl font-medium">Kristi Sipes</h1>
                      <button className="p-1">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M6 9l6 6 6-6" />
                        </svg>
                      </button>
                    </div>
                    <div className="flex items-center gap-4">
                      <Button variant="ghost" size="icon">
                        <MoreIcon size={20} />
                      </Button>
                      <Button className="bg-teal-600 hover:bg-teal-700">
                        <svg className="mr-2" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                          <path d="M21 15l-9 9-9-9m0 0V3l9 9 9-9v12"></path>
                        </svg>
                        Send Email
                      </Button>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 mt-1 mb-4">
                    <span className="flex items-center text-yellow-400">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                      </svg>
                      <span className="ml-1 text-gray-700">3.5 Overall</span>
                    </span>
                    <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full flex items-center">
                      <span className="mr-1 w-2 h-2 rounded-full bg-green-500"></span>
                      Active
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div>
                      <p className="text-gray-500">Origin</p>
                      <p className="font-medium">Career Site</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Applied at</p>
                      <p className="font-medium">13 October, 2023</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Job Applied</p>
                      <p className="font-medium">Research and Development</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="border-t flex">
                <button className="flex-1 py-4 px-4 flex items-center justify-center gap-2 font-medium text-blue-600 border-b-2 border-blue-600">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10" />
                    <path d="M12 16v-4M12 8h.01" />
                  </svg>
                  Job Application
                </button>
                <button className="flex-1 py-4 px-4 flex items-center justify-center gap-2 text-gray-500">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
                    <path d="M14 2v6h6M16 13H8M16 17H8M10 9H8" />
                  </svg>
                  Resume
                </button>
                <button className="flex-1 py-4 px-4 flex items-center justify-center gap-2 text-gray-500">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
                  </svg>
                  Form Submission
                </button>
                <button className="flex-1 py-4 px-4 flex items-center justify-center gap-2 text-gray-500">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10" />
                    <path d="M8 14s1.5 2 4 2 4-2 4-2M9 9h.01M15 9h.01" />
                  </svg>
                  Interview
                </button>
              </div>
            </CardContent>
          </Card>

          <div className="space-y-6">
            <h2 className="text-lg font-medium">Hiring Process</h2>
            
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="bg-gray-200 h-2 rounded-full flex">
                  <div className="bg-blue-500 h-2 rounded-full w-1/5"></div>
                  <div className="bg-blue-500 h-2 rounded-full w-1/5"></div>
                  <div className="bg-gray-300 h-2 rounded-full w-1/5"></div>
                  <div className="bg-gray-300 h-2 rounded-full w-1/5"></div>
                  <div className="bg-gray-300 h-2 rounded-full w-1/5"></div>
                </div>
                <div className="flex mt-2 text-xs text-gray-500">
                  <div className="w-1/5 font-medium">Applying</div>
                  <div className="w-1/5 font-medium">Screening</div>
                  <div className="w-1/5">Interview</div>
                  <div className="w-1/5">Test</div>
                  <div className="w-1/5">Onboarding</div>
                </div>
              </div>
              <Button variant="outline" className="ml-4 text-sm">
                Move Stage
                <svg className="ml-2" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M9 18l6-6-6-6" />
                </svg>
              </Button>
            </div>
          </div>

          <Card className="shadow-sm">
            <CardContent className="p-6">
              <h2 className="text-lg font-medium mb-4">Candidate Score</h2>
              
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center">
                  <div className="text-4xl font-medium mr-6">3.5</div>
                  <div className="flex text-yellow-400">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="gray" opacity="0.3"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
                  </div>
                </div>
                <div className="text-sm text-gray-500">Overall score</div>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center">
                  <div className="w-24 text-sm">Applying</div>
                  <div className="flex-1 mr-4">
                    <div className="h-2 bg-gray-200 rounded-full">
                      <div className="h-2 bg-yellow-400 rounded-full w-[60%]"></div>
                    </div>
                  </div>
                  <div className="flex items-center text-yellow-400">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
                    <span className="ml-1">3</span>
                  </div>
                </div>
                
                <div className="flex items-center">
                  <div className="w-24 text-sm">Screening</div>
                  <div className="flex-1 mr-4">
                    <div className="h-2 bg-gray-200 rounded-full">
                      <div className="h-2 bg-yellow-400 rounded-full w-[80%]"></div>
                    </div>
                  </div>
                  <div className="flex items-center text-yellow-400">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
                    <span className="ml-1">4</span>
                  </div>
                </div>
                
                <div className="flex items-center">
                  <div className="w-24 text-sm">Interview</div>
                  <div className="flex-1 mr-4">
                    <div className="h-2 bg-gray-200 rounded-full">
                      <div className="h-2 bg-gray-400 rounded-full w-[0%]"></div>
                    </div>
                  </div>
                  <div className="flex items-center text-gray-400">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
                    <span className="ml-1">0</span>
                  </div>
                </div>
                
                <div className="flex items-center">
                  <div className="w-24 text-sm">Test</div>
                  <div className="flex-1 mr-4">
                    <div className="h-2 bg-gray-200 rounded-full">
                      <div className="h-2 bg-gray-400 rounded-full w-[0%]"></div>
                    </div>
                  </div>
                  <div className="flex items-center text-gray-400">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
                    <span className="ml-1">0</span>
                  </div>
                </div>
                
                <div className="flex items-center">
                  <div className="w-24 text-sm">Onboarding</div>
                  <div className="flex-1 mr-4">
                    <div className="h-2 bg-gray-200 rounded-full">
                      <div className="h-2 bg-gray-400 rounded-full w-[0%]"></div>
                    </div>
                  </div>
                  <div className="flex items-center text-gray-400">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
                    <span className="ml-1">0</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-medium">Jobs Applied</h2>
              <Button variant="ghost" className="text-sm">
                View details
                <svg className="ml-2" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M9 18l6-6-6-6" />
                </svg>
              </Button>
            </div>
            
            <Card className="shadow-sm">
              <CardContent className="p-6">
                <h3 className="font-medium mb-4">Research and Development Officer</h3>
                <div className="flex flex-wrap gap-4 text-sm">
                  <div className="flex items-center gap-2 text-gray-600">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
                      <path d="M16 21V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v16" />
                    </svg>
                    <span>Fulltime</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" />
                      <circle cx="12" cy="10" r="3" />
                    </svg>
                    <span>Jogja</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M12 2a3 3 0 00-3 3v7a3 3 0 006 0V5a3 3 0 00-3-3z" />
                      <path d="M19 10v2a7 7 0 01-14 0v-2M12 19v3M8 23h8" />
                    </svg>
                    <span>Onsite</span>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <div className="grid grid-cols-2 gap-4 text-sm">
              <Card className="shadow-sm">
                <CardContent className="p-4">
                  <div className="text-gray-500 mb-1">Experience in Years</div>
                  <div className="font-medium">4 Years</div>
                </CardContent>
              </Card>
              <Card className="shadow-sm">
                <CardContent className="p-4">
                  <div className="text-gray-500 mb-1">Current Employer</div>
                  <div className="font-medium">Acme Studio</div>
                </CardContent>
              </Card>
              <Card className="shadow-sm">
                <CardContent className="p-4">
                  <div className="text-gray-500 mb-1">Expected Salary</div>
                  <div className="font-medium">8.000.000 IDR</div>
                </CardContent>
              </Card>
              <Card className="shadow-sm">
                <CardContent className="p-4">
                  <div className="text-gray-500 mb-1">Current Salary</div>
                  <div className="font-medium">5.000.000 IDR</div>
                </CardContent>
              </Card>
            </div>
          </div>

          <div className="space-y-4">
            <h2 className="text-lg font-medium">Score Card</h2>
            
            <Card className="shadow-sm">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-medium">Relevant Education</h3>
                  <Button size="sm" variant="outline" className="h-8 w-8 p-0 rounded-full">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" />
                      <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" />
                    </svg>
                  </Button>
                </div>
                <p className="text-sm text-gray-500">Refers to the academic background and certifications that a candidate possesses.</p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* 右侧信息栏 */}
        <div className="col-span-4 space-y-6">
          <Card className="shadow-sm">
            <CardContent className="p-6">
              <h2 className="text-lg font-medium mb-4">Personal Information</h2>
              
              <div className="space-y-4">
                <div className="flex items-center">
                  <div className="w-8 flex-shrink-0">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                      <polyline points="22,6 12,13 2,6" />
                    </svg>
                  </div>
                  <div className="ml-2">
                    <div className="text-sm text-gray-500">Email Address</div>
                    <div className="text-sm font-medium">
                      <span className="px-2 py-1 bg-blue-50 text-blue-600 rounded">kristisipes@gmail.com</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center">
                  <div className="w-8 flex-shrink-0">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z" />
                    </svg>
                  </div>
                  <div className="ml-2">
                    <div className="text-sm text-gray-500">Phone Number</div>
                    <div className="text-sm font-medium">
                      <span className="px-2 py-1 bg-blue-50 text-blue-600 rounded">+62-921-019-112</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center">
                  <div className="w-8 flex-shrink-0">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
                      <circle cx="12" cy="7" r="4" />
                    </svg>
                  </div>
                  <div className="ml-2">
                    <div className="text-sm text-gray-500">Gender</div>
                    <div className="text-sm font-medium">Female</div>
                  </div>
                </div>
                
                <div className="flex items-center">
                  <div className="w-8 flex-shrink-0">
                    <CalendarIcon size={20} />
                  </div>
                  <div className="ml-2">
                    <div className="text-sm text-gray-500">Birthdate</div>
                    <div className="text-sm font-medium">May 20, 2000</div>
                  </div>
                </div>
                
                <div className="flex items-center">
                  <div className="w-8 flex-shrink-0">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" />
                      <circle cx="12" cy="10" r="3" />
                    </svg>
                  </div>
                  <div className="ml-2">
                    <div className="text-sm text-gray-500">Living Address</div>
                    <div className="text-sm font-medium">New York, NY, 10001, United States</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-sm">
            <CardContent className="p-6">
              <h2 className="text-lg font-medium mb-4">Education Information</h2>
              
              <div className="space-y-4">
                <div className="flex items-center">
                  <div className="w-8 flex-shrink-0">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
                      <path d="M6 12v5c3 3 9 3 12 0v-5" />
                    </svg>
                  </div>
                  <div className="ml-2">
                    <div className="text-sm text-gray-500">University</div>
                    <div className="text-sm font-medium">Boston University</div>
                  </div>
                </div>
                
                <div className="flex items-center">
                  <div className="w-8 flex-shrink-0">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M4 7V4a2 2 0 012-2h8.5L20 7.5V20a2 2 0 01-2 2H6a2 2 0 01-2-2v-3" />
                      <polyline points="14 2 14 8 20 8" />
                      <path d="M10 12H4v6h6v-6z" />
                      <path d="M10 12v6" />
                      <path d="M4 15h6" />
                    </svg>
                  </div>
                  <div className="ml-2">
                    <div className="text-sm text-gray-500">Qualification Held</div>
                    <div className="text-sm font-medium">Bachelor of Engineering</div>
                  </div>
                </div>
                
                <div className="flex items-center">
                  <div className="w-8 flex-shrink-0">
                    <CalendarIcon size={20} />
                  </div>
                  <div className="ml-2">
                    <div className="text-sm text-gray-500">Year Graduation</div>
                    <div className="text-sm font-medium">2014</div>
                  </div>
                </div>
                
                <div className="flex items-center">
                  <div className="w-8 flex-shrink-0">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M16 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
                      <circle cx="8.5" cy="7" r="4" />
                      <path d="M20 8v6M23 11h-6" />
                    </svg>
                  </div>
                  <div className="ml-2">
                    <div className="text-sm text-gray-500">Referral</div>
                    <div className="text-sm font-medium text-gray-400">Not Provided</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-sm">
            <CardContent className="p-6">
              <h2 className="text-lg font-medium mb-4">Notes</h2>
              
              <div className="border rounded-lg p-3">
                <div className="flex items-center">
                  <textarea 
                    placeholder="Write note..." 
                    className="w-full h-16 text-sm border-0 focus:outline-none focus:ring-0 resize-none"
                  ></textarea>
                </div>
                <div className="flex justify-end border-t pt-2">
                  <button className="p-1 text-gray-400 hover:text-gray-600">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M14.5 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V7.5L14.5 2z" />
                      <polyline points="14 2 14 8 20 8" />
                      <path d="M16 13H8M16 17H8M10 9H8" />
                    </svg>
                  </button>
                  <button className="p-1 text-gray-400 hover:text-gray-600 ml-2">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M20.59 13.41l-7.17 7.17a2 2 0 01-2.83 0L2 12V2h10l8.59 8.59a2 2 0 010 2.82z" />
                      <line x1="7" y1="7" x2="7.01" y2="7" />
                    </svg>
                  </button>
                  <button className="p-1 text-gray-400 hover:text-gray-600 ml-2">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M21 11.5a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 01-7.6 4.7 8.38 8.38 0 01-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 01-.9-3.8 8.5 8.5 0 014.7-7.6 8.38 8.38 0 013.8-.9h.5a8.48 8.48 0 018 8v.5z" />
                    </svg>
                  </button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
} 