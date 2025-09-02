import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Linking from 'expo-linking';
import { openAuthSessionAsync } from 'expo-web-browser';
import {
  Account,
  Avatars,
  Client,
  Databases,
  ID,
  OAuthProvider,
  Query,
} from 'react-native-appwrite';

export const config = {
  platform: 'com.biggie.findrr',
  endpoint: process.env.EXPO_PUBLIC_APPWRITE_ENDPOINT,
  projectId: process.env.EXPO_PUBLIC_APPWRITE_PROJECT_ID,
  databaseId: process.env.EXPO_PUBLIC_APPWRITE_DATABASE_ID,
  applicantCollectionId:
    process.env.EXPO_PUBLIC_APPWRITE_APPLICANT_COLLECTION_ID,
  recruiterCollectionId:
    process.env.EXPO_PUBLIC_APPWRITE_RECRUITER_COLLECTION_ID,
  jobsCollectionId: process.env.EXPO_PUBLIC_APPWRITE_JOBS_COLLECTION_ID,
};

export const client = new Client();

client
  .setEndpoint(config.endpoint!)
  .setProject(config.projectId!)
  .setPlatform(config.platform!);

export const avatar = new Avatars(client);
export const account = new Account(client);
export const databases = new Databases(client);

export async function googleLogin() {
  try {
    const redirectUri = Linking.createURL('/');

    const response = await account.createOAuth2Token(
      OAuthProvider.Google,
      redirectUri
    );

    if (!response) throw new Error('Login failed');

    const browserResult = await openAuthSessionAsync(
      response.toString(),
      redirectUri
    );

    if (browserResult.type !== 'success') throw new Error('Login cancelled');

    const url = new URL(browserResult.url);

    const secret = url.searchParams.get('secret')?.toString();
    const userId = url.searchParams.get('userId')?.toString();

    if (!secret || !userId) throw new Error('Login failed');

    const session = await account.createSession(userId, secret);

    if (!session) throw new Error('Failed too create a session');

    return true;
  } catch (error) {
    console.error(error);
    return false;
  }
}

export async function logout() {
  try {
    await account.deleteSession('current');
    await AsyncStorage.removeItem('user');
    return true;
  } catch (error) {
    console.error(error);
    return false;
  }
}

export async function getCurrentUser() {
  try {
    const response = await account.get();

    if (response && response.$id) {
      const userAvatar = avatar.getInitials(
        response.name || response.email || 'U'
      );

      // Try to determine user type by checking both collections
      let userType: 'applicant' | 'recruiter' | null = null;
      let userProfile = null;

      // Check applicant collection first
      try {
        const applicantDocs = await databases.listDocuments(
          config.databaseId!,
          config.applicantCollectionId!,
          [Query.equal('userId', response.$id)]
        );

        if (applicantDocs.documents.length > 0) {
          userType = 'applicant';
          userProfile = applicantDocs.documents[0];
        } else {
          // Check recruiter collection
          const recruiterDocs = await databases.listDocuments(
            config.databaseId!,
            config.recruiterCollectionId!,
            [Query.equal('userId', response.$id)]
          );

          if (recruiterDocs.documents.length > 0) {
            userType = 'recruiter';
            userProfile = recruiterDocs.documents[0];
          }
        }
      } catch (error) {
        console.error('Error fetching user profile:', error);
        // Continue without userType if there's an error
      }

      const userData = {
        ...response,
        avatar: userAvatar.toString(),
        userType,
        profile: userProfile,
      };

      // Cache in storage
      await AsyncStorage.setItem('user', JSON.stringify(userData));

      return userData;
    }

    return null;
  } catch (error) {
    // If Appwrite says no session, check local cache (optional)
    const cached = await AsyncStorage.getItem('user');
    return cached ? JSON.parse(cached) : null;
  }
}

export async function createApplicantAccount(userData: {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone?: string;
}) {
  try {
    // Create Appwrite account
    const accountResponse = await account.create(
      ID.unique(),
      userData.email,
      userData.password,
      `${userData.firstName} ${userData.lastName}`
    );

    if (!accountResponse.$id) {
      throw new Error('Failed to create account');
    }

    // Create session
    await account.createEmailPasswordSession(userData.email, userData.password);

    // Create applicant document in database
    const applicantDocument = await databases.createDocument(
      config.databaseId!,
      config.applicantCollectionId!,
      ID.unique(),
      {
        userId: accountResponse.$id,
        email: userData.email,
        firstName: userData.firstName,
        lastName: userData.lastName,
        phone: userData.phone || '',
        userType: 'applicant',
        avatar: null,
        location: '',
        resume: '',
        applicationCount: 0,
        interviewCount: 0,
        profileCompleteCount: 0,
        savedJobsCount: 0,
        createdAt: new Date().toISOString(),
      }
    );

    return { account: accountResponse, applicant: applicantDocument };
  } catch (error) {
    console.error('Error creating applicant account:', error);
    throw error;
  }
}

export async function createRecruiterAccount(userData: {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone?: string;
  companyName: string;
  companyWebsite?: string;
}) {
  try {
    // Create Appwrite account
    const accountResponse = await account.create(
      ID.unique(),
      userData.email,
      userData.password,
      `${userData.firstName} ${userData.lastName}`
    );

    if (!accountResponse.$id) {
      throw new Error('Failed to create account');
    }

    // Create session
    await account.createEmailPasswordSession(userData.email, userData.password);

    // Create recruiter document in database
    const recruiterDocument = await databases.createDocument(
      config.databaseId!,
      config.recruiterCollectionId!,
      ID.unique(),
      {
        userId: accountResponse.$id,
        email: userData.email,
        firstName: userData.firstName,
        lastName: userData.lastName,
        phone: userData.phone || '',
        companyName: userData.companyName,
        companyWebsite: userData.companyWebsite || '',
        userType: 'recruiter',
        createdAt: new Date().toISOString(),
      }
    );

    return { account: accountResponse, recruiter: recruiterDocument };
  } catch (error) {
    console.error('Error creating recruiter account:', error);
    throw error;
  }
}

export async function getUserProfile(
  userId: string,
  userType: 'applicant' | 'recruiter'
) {
  try {
    const collectionId =
      userType === 'applicant'
        ? config.applicantCollectionId!
        : config.recruiterCollectionId!;

    const documents = await databases.listDocuments(
      config.databaseId!,
      collectionId,
      [Query.equal('userId', userId)]
    );

    if (documents.documents.length > 0) {
      return documents.documents[0];
    }
    return null;
  } catch (error) {
    console.error('Error fetching user profile:', error);
    throw error;
  }
}

export async function emailPasswordLogin(email: string, password: string) {
  try {
    // Create email/password session
    const session = await account.createEmailPasswordSession(email, password);

    if (!session.$id) {
      throw new Error('Failed to create session');
    }

    // Get current user details
    const user = await getCurrentUser();

    return {
      success: true,
      session,
      user,
    };
  } catch (error) {
    console.error('Email/password login error:', error);

    // Handle specific error cases
    if (error instanceof Error) {
      if (error.message.includes('Invalid credentials')) {
        throw new Error('Invalid email or password');
      } else if (error.message.includes('User not found')) {
        throw new Error('No account found with this email');
      } else if (error.message.includes('rate limit')) {
        throw new Error('Too many attempts. Please try again later');
      }
    }

    throw new Error('Login failed. Please try again.');
  }
}

export async function createJob(jobData: {
  title: string;
  requirements: string[];
  location: string;
  salary: string;
  description: string;
  recruiterId: string;
  companyName: string;
  jobType: string[];
  deadline: Date | null;
}) {
  try {
    const job = {
      jobId: ID.unique(),
      active: true,
      title: jobData.title,
      requirements: jobData.requirements,
      location: jobData.location,
      salary: jobData.salary,
      description: jobData.description,
      recruiterId: jobData.recruiterId,
      companyName: jobData.companyName,
      jobType: jobData.jobType,
      deadline: jobData.deadline ? jobData.deadline.toISOString() : null,
      createdAt: new Date().toISOString(),
    };

    const response = await databases.createDocument(
      config.databaseId!,
      config.jobsCollectionId!,
      ID.unique(),
      job
    );

    console.log('Job created:', response);
    return response;
  } catch (error) {
    console.error('Error creating job:', error);
    throw new Error('Failed to post job. Please try again.');
  }
}

export async function fetchRecruiterJobs(userId: string) {
  try {
    const response = await databases.listDocuments(
      config.databaseId!,
      config.jobsCollectionId!,
      [
        Query.equal("recruiterId", userId)
      ]
    );

    // response.documents contains the jobs array
    return response.documents;
  } catch (error) {
    console.error('Error fetching jobs:', error);
    throw new Error('Failed to fetch jobs');
  }
}

export async function fetchAllJobs() {
  try {
    const response = await databases.listDocuments(
      config.databaseId!,
      config.jobsCollectionId!,
      []
    );

    return response.documents;
  } catch (error) {
    console.error('Error fetching all jobs:', error);
    throw new Error('Failed to fetch jobs');
  }
}
