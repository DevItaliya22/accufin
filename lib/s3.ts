import { GetObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

export const s3 = {
  // To get list of my uploaded files in user dashboard
  listOfUsersSentFiles: (userId: string) => {
    return `user-uploads/${userId}/sent`;
  },
  // To get list of Admin Responses files in user dashboard
  listOfUsersReceivedFiles: (userId: string) => {
    return `user-uploads/${userId}/received`;
  },
  // To get path while uploading user file to s3 in user dashboard
  getUserSendingFilePath: (userId: string, filename: string) => {
    return `user-uploads/${userId}/sent/${filename}`;
  },
  // To get path while uploading Admin Response file to s3 in admin dashboard
  getUserReceivedFilePath: (userId: string, filename: string) => {
    return `user-uploads/${userId}/received/${filename}`;
  },

  // To get path for testimonial image uploads
  getTestimonialImagePath: (filename: string) => {
    const timestamp = Date.now();
    return `testimonials/${timestamp}/${filename}`;
  },

  getAdminPrivateUploadPath: (
    adminId: string,
    userId: string,
    filename: string
  ) => {
    return `admin-private-uploads/${adminId}/${userId}/${filename}`;
  },

  getUserProfilePicturePath: (userId: string, filename: string) => {
    return `user-uploads/${userId}/profile/${filename}`;
  },
};

export const getSignedUrlFromPath = async (path: string) => {
  const s3 = new S3Client({
    region: process.env.AWS_REGION!,
    credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
    },
  });
  const command = new GetObjectCommand({
    Bucket: process.env.AWS_S3_BUCKET!,
    Key: path,
  });
  const signedUrl = await getSignedUrl(s3, command, {
    expiresIn: 60 * 60 * 12,
  }); // 12 hours
  return signedUrl;
};
