import AWS from 'aws-sdk';

export async function UploadToS3(file:File) {
    try {
        AWS.config.update({
            accessKeyId: process.env.NEXT_PUBLIC_AWS_ACCESS_KEY_ID,
            secretAccessKey: process.env.NEXT_PUBLIC_AWS_SECRET_ACCESS_KEY,
        });
        const s3 = new AWS.S3({
            params : {
                Bucket: process.env.NEXT_PUBLIC_AWS_BUCKET_NAME,
            },
            region: 'ap-south-1'
        });
        const file_key = 'uploads/'+ Date.now().toString() + file.name.replace(' ', '-');
        const params = {
            Bucket: process.env.NEXT_PUBLIC_AWS_BUCKET_NAME!,
            Key: file_key,
            Body: file,
        }
        const upload = s3.putObject(params).on('httpUploadProgress', function(evt) {
            console.log(parseInt(((evt.loaded * 100)/ evt.total).toString())+"% uploaded");
        }).promise();
        await upload.then((data) => {
            console.log("success",data);
        }).catch((err) => {
            console.log("error",err);
        });
        return Promise.resolve({
            file_key,
            file_name: file.name,
        });
    } catch (error) {
        console.log(error);
    }
}

export function getS3Url (file_key:string) {
    const s3 = new AWS.S3({
        params : {
            Bucket: process.env.NEXT_PUBLIC_AWS_BUCKET_NAME,
        },
        region: 'ap-south-1'
    });
    const params = {
        Bucket: process.env.NEXT_PUBLIC_AWS_BUCKET_NAME!,
        Key: file_key,
    }
    const url = s3.getSignedUrl('getObject', params);
    console.log(url);
    return url;
}