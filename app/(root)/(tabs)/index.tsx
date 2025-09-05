import { fetchAllJobs, fetchRecruiterJobs, getCurrentUser } from '@/lib/appwrite';
import { Ionicons } from '@expo/vector-icons';
import { Link, router } from 'expo-router';
import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Image,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useGlobalContext } from '../../../lib/global-provider';

// Mock data for recommended jobs (fallback)
const mockRecommendedJobs = [
  {
    id: 1,
    title: 'Frontend Developer',
    company: 'TechCorp Inc.',
    location: 'San Francisco, CA',
    salary: '$90,000 - $120,000',
    type: 'Full-time',
    posted: '2 days ago',
    logo: require('../../../assets/images/logo.png'),
  },
  {
    id: 2,
    title: 'UX Designer',
    company: 'DesignStudio',
    location: 'New York, NY',
    salary: '$85,000 - $110,000',
    type: 'Full-time',
    posted: '1 day ago',
    logo: require('../../../assets/images/logo.png'),
  },
  {
    id: 3,
    title: 'Backend Engineer',
    company: 'DataSystems',
    location: 'Austin, TX',
    salary: '$95,000 - $130,000',
    type: 'Full-time',
    posted: '3 days ago',
    logo: require('../../../assets/images/logo.png'),
  },
];

// Mock data for application status
const applicationStatus = [
  {
    id: 1,
    jobTitle: 'Frontend Developer',
    company: 'TechCorp Inc.',
    status: 'Under Review',
    progress: 50,
    date: 'Applied 3 days ago',
  },
  {
    id: 2,
    jobTitle: 'Product Manager',
    company: 'InnovateCo',
    status: 'Interview Scheduled',
    progress: 75,
    date: 'Applied 1 week ago',
  },
  {
    id: 3,
    jobTitle: 'Data Analyst',
    company: 'AnalyticsPro',
    status: 'Application Sent',
    progress: 25,
    date: 'Applied yesterday',
  },
];

// Quick actions data - Different for applicants and recruiters
const applicantQuickActions = [
  {
    id: 1,
    title: 'Find Jobs',
    icon: 'search',
    href: '/Jobs',
    color: 'bg-blue-600',
  },
  {
    id: 2,
    title: 'My Applications',
    icon: 'document-text',
    href: '/Applications',
    color: 'bg-green-600',
  },
  {
    id: 3,
    title: 'Saved Jobs',
    icon: 'bookmark',
    href: '/Saved',
    color: 'bg-purple-600',
  },
];

const recruiterQuickActions = [
  {
    id: 1,
    title: 'Post Job',
    icon: 'add-circle',
    href: '/PostJob',
    color: 'bg-blue-600',
  },
  {
    id: 2,
    title: 'Candidates',
    icon: 'people',
    href: '/Candidates',
    color: 'bg-green-600',
  },
  {
    id: 3,
    title: 'Interviews',
    icon: 'calendar',
    href: '/Interviews',
    color: 'bg-purple-600',
  },
  {
    id: 4,
    title: 'Analytics',
    icon: 'stats-chart',
    href: '/Analytics',
    color: 'bg-orange-600',
  },
];

const JobCard = ({ job }: { job: any }) => (
  <View className="bg-white rounded-xl p-4 mr-4 shadow-sm border border-gray-100 min-w-[280px]">
    <View className="flex-row items-center mb-3">
      <Image
        source={job.logo || require('../../../assets/images/logo.png')}
        className="w-12 h-12 border border-gray-100 bg-gray-50 rounded-full mr-3"
        resizeMode="contain"
      />
      <View className="flex-1">
        <Text className="text-lg font-rubik-bold text-gray-900">
          {job.title}
        </Text>
        <Text className="text-gray-600 font-rubik">{job.companyName}</Text>
      </View>
    </View>
    <View className="flex flex-col gap-2">
      <View className="flex-row items-center">
        <Ionicons name="location-outline" size={16} color="#6B7280" />
        <Text className="text-gray-600 text-sm ml-2 font-rubik">
          {job.location} {job.jobType ? `• ${job.jobType.join(', ')}` : ''}
        </Text>
      </View>
      <View className="flex-row items-center">
        <Ionicons name="cash-outline" size={16} color="#6B7280" />
        <Text className="text-gray-600 text-sm ml-2 font-rubik">
          {job.salary}
        </Text>
      </View>
      <View className="flex-row items-center">
        <Ionicons name="time-outline" size={16} color="#6B7280" />
        <Text className="text-gray-600 text-sm ml-2 font-rubik">
          {job.createdAt || 'Recently'}
        </Text>
      </View>
    </View>
    <TouchableOpacity
      className="bg-blue-600 rounded-lg py-2 px-4 mt-4"
      onPress={() => router.navigate(`/jobs/${job.id || job.jobId}`)}
    >
      <Text className="text-white text-center font-rubik-medium">
        Apply Now
      </Text>
    </TouchableOpacity>
  </View>
);

const StatusCard = ({
  application,
}: {
  application: (typeof applicationStatus)[0];
}) => (
  <View className="bg-white rounded-xl p-4 mb-3 shadow-sm border border-gray-100">
    <View className="flex-row justify-between items-start mb-3">
      <View className="flex-1">
        <Text className="text-lg font-rubik-bold text-gray-900">
          {application.jobTitle}
        </Text>
        <Text className="text-gray-600 font-rubik">{application.company}</Text>
      </View>
      <View className="bg-blue-100 px-3 py-1 rounded-full">
        <Text className="text-blue-600 text-sm font-rubik-medium">
          {application.status}
        </Text>
      </View>
    </View>
    <View className="mb-3">
      <View className="w-full bg-gray-200 rounded-full h-2">
        <View
          className="bg-blue-600 h-2 rounded-full"
          style={{ width: `${application.progress}%` }}
        />
      </View>
    </View>
    <Text className="text-gray-500 text-sm font-rubik">{application.date}</Text>
  </View>
);

const QuickActionCard = ({ action }: { action: any }) => {
  const href = action.href as any;
  return (
    <Link href={href} asChild>
      <TouchableOpacity
        className={`${action.color} rounded-xl p-4 items-center justify-center min-w-[140px] mr-4`}
      >
        <Ionicons name={action.icon as any} size={24} color="white" />
        <Text className="text-white text-center font-rubik-medium mt-2">
          {action.title}
        </Text>
      </TouchableOpacity>
    </Link>
  );
};

export default function Index() {
  const { user } = useGlobalContext();
  const [pageLoading, setPageLoading] = useState(false);
  const [myJobs, setMyJobs] = useState<any[]>([]);
  const [recommendedJobs, setRecommendedJobs] = useState<any[]>(mockRecommendedJobs);

  useEffect(() => {
    const checkUser = async () => {
      setPageLoading(true);
      try {
        const result = await getCurrentUser();

        if (!result) {
          router.navigate('/Onboarding');
          return;
        }

        console.log(result);
        

        const userId = result.$id;

        console.log(userId);
        

        if (user?.userType === 'recruiter') {
          const jobs = await fetchRecruiterJobs(userId);
          setMyJobs(jobs);
        } else if (user?.userType === 'applicant') {
          const allJobs = await fetchAllJobs();
          setRecommendedJobs(allJobs.slice(0, 3));
        }

        setPageLoading(false);
      } catch (error) {
        console.error('Error loading user or jobs:', error);
        setPageLoading(false);
      }
    };

    checkUser();
  }, [user]);

  if (pageLoading) {
    return (
      <SafeAreaView className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" color="#3B82F6" className="mt-4" />
      </SafeAreaView>
    );
  }

  const quickActions =
    user?.userType === 'recruiter'
      ? recruiterQuickActions
      : applicantQuickActions;

  return (
    <SafeAreaView className="flex-1 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* Modern Header */}
        <View className="bg-white/80 backdrop-blur-lg border-b border-white/20">
          <View className="flex-row justify-between items-center px-6 py-6">
            <View className="flex-1">
              <Text className="text-2xl font-rubik-bold text-slate-900">
                Welcome back,
              </Text>
              <Text className="text-lg font-rubik text-slate-600">
                {user?.name || 'Ayonitemi!'}
              </Text>
            </View>
            <View className="w-12 h-12 bg-slate-100 rounded-2xl items-center justify-center">
              <Ionicons name="person" size={24} color="#475569" />
            </View>
          </View>
        </View>

        {/* Quick Actions */}
        <View className="px-6 py-6">
          <View className="flex-row items-center mb-6">
            <View className="w-10 h-10 bg-blue-600 rounded-2xl items-center justify-center mr-3">
              <Ionicons name="flash" size={20} color="white" />
            </View>
            <Text className="text-xl font-rubik-bold text-slate-900">
              Quick Access
            </Text>
          </View>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            className="mb-6"
          >
            <View className="flex-row">
              {quickActions.map((action) => (
                <QuickActionCard key={action.id} action={action} />
              ))}
            </View>
          </ScrollView>
        </View>

        {/* Conditional Rendering */}
        {user?.userType === 'applicant' && (
          <>
            {/* Recommended Jobs */}
            <View className="px-6 py-4">
              <View className="flex-row justify-between items-center mb-4">
                <Text className="text-xl font-rubik-bold text-gray-900">
                  Recommended for You
                </Text>
                <Link href="/Jobs">
                  <Text className="text-blue-600 font-rubik-medium">
                    See All
                  </Text>
                </Link>
              </View>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                className="pb-4"
              >
                <View className="flex-row">
                  {recommendedJobs.map((job, index) => (
                    <JobCard key={index} job={job} />
                  ))}
                </View>
              </ScrollView>
            </View>

            {/* Application Status */}
            <View className="px-6 py-4">
              <View className="flex-row justify-between items-center mb-4">
                <Text className="text-xl font-rubik-bold text-gray-900">
                  Application Status
                </Text>
                <Link href="/Applications">
                  <Text className="text-blue-600 font-rubik-medium">
                    View All
                  </Text>
                </Link>
              </View>
              {applicationStatus.map((application) => (
                <StatusCard key={application.id} application={application} />
              ))}
            </View>
          </>
        )}

        {/* Job Posting Statistics */}
        {user?.userType === 'recruiter' && (
          <View className="px-6 py-4">
            <Text className="text-xl font-rubik-bold text-gray-900 mb-4">
              Job Posting Statistics
            </Text>
            <View className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
              <Text className="font-rubik-medium text-gray-900">
                Total Jobs Posted: {myJobs.length}
              </Text>
              <Text className="font-rubik-medium text-gray-900">
                Jobs Filled: 0
              </Text>
              <Text className="font-rubik-medium text-gray-900">
                Jobs Open: {myJobs.length}
              </Text>
            </View>
          </View>
        )}

        {/* Candidate Pipeline Overview */}
        {user?.userType === 'recruiter' && (
          <View className="px-6 py-4">
            <Text className="text-xl font-rubik-bold text-gray-900 mb-4">
              Candidate Pipeline Overview
            </Text>
            <View className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
              <Text className="font-rubik-medium text-gray-900">
                Total Candidates: 20
              </Text>
              <Text className="font-rubik-medium text-gray-900">
                Interviews Scheduled: 3
              </Text>
              <Text className="font-rubik-medium text-gray-900">
                Offers Made: 2
              </Text>
            </View>
          </View>
        )}

        {/* Upcoming Interviews */}
        {user?.userType === 'recruiter' && (
          <View className="px-6 py-4">
            <Text className="text-xl font-rubik-bold text-gray-900 mb-4">
              Upcoming Interviews
            </Text>
            <View className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
              <Text className="font-rubik-medium text-gray-900">
                Frontend Developer - 2 days
              </Text>
              <Text className="font-rubik-medium text-gray-900">
                UX Designer - 5 days
              </Text>
              <Text className="font-rubik-medium text-gray-900">
                Data Analyst - 1 week
              </Text>
            </View>
          </View>
        )}

        {/* Recent Activity */}
        <View className="px-6 py-6 mb-14">
          <Text className="text-xl font-rubik-bold text-gray-900 mb-4">
            Recent Activity
          </Text>
          <View className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
            <View className="flex-row items-center mb-3">
              <View className="bg-green-100 p-2 rounded-full mr-3">
                <Ionicons name="checkmark-circle" size={20} color="#10B981" />
              </View>
              <View className="flex-1">
                <Text className="font-rubik-medium text-gray-900">
                  {user?.userType === 'recruiter'
                    ? 'Job Posted'
                    : 'Application Submitted'}
                </Text>
                <Text className="text-gray-600 text-sm font-rubik">
                  {user?.userType === 'recruiter'
                    ? 'Frontend Developer position'
                    : 'Frontend Developer at TechCorp'}
                </Text>
              </View>
              <Text className="text-gray-500 text-sm font-rubik">2h ago</Text>
            </View>
            <View className="flex-row items-center mb-3">
              <View className="bg-blue-100 p-2 rounded-full mr-3">
                <Ionicons name="eye" size={20} color="#3B82F6" />
              </View>
              <View className="flex-1">
                <Text className="font-rubik-medium text-gray-900">
                  {user?.userType === 'recruiter'
                    ? 'Candidate Viewed'
                    : 'Profile Viewed'}
                </Text>
                <Text className="text-gray-600 text-sm font-rubik">
                  {user?.userType === 'recruiter'
                    ? "John Doe's profile"
                    : 'By InnovateCo Recruiter'}
                </Text>
              </View>
              <Text className="text-gray-500 text-sm font-rubik">1d ago</Text>
            </View>
            <View className="flex-row items-center">
              <View className="bg-purple-100 p-2 rounded-full mr-3">
                <Ionicons name="bookmark" size={20} color="#8B5CF6" />
              </View>
              <View className="flex-1">
                <Text className="font-rubik-medium text-gray-900">
                  {user?.userType === 'recruiter'
                    ? 'Candidate Saved'
                    : 'Job Saved'}
                </Text>
                <Text className="text-gray-600 text-sm font-rubik">
                  {user?.userType === 'recruiter'
                    ? 'Jane Smith for UX Designer role'
                    : 'Senior UX Designer at DesignStudio'}
                </Text>
              </View>
              <Text className="text-gray-500 text-sm font-rubik">2d ago</Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
