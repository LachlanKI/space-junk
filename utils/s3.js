const knox = require('knox');
const fs = require('fs');

let secrets;
if(process.env.NODE_ENV == 'production') {
    secrets = process.env;
} else {
    secrets = require('./secrets.json');
}

const client = knox.createClient({
    key: secrets.aws_key,
    secret: secrets.aws_secret,
    bucket: 'wolfmansgotnards'
});

function uploadS3(file) {
    return new Promise((resolve, reject) => {
        const s3Request = client.put(file.filename, {
            'Content-Type': file.mimetype,
            'Content-Length': file.size,
            'x-amz-acl': 'public-read'
        });
        const readStream = fs.createReadStream(file.path);
        readStream.pipe(s3Request);
        s3Request.on('response', s3Response => {
            const wasSuccessful = s3Response.statusCode == 200;
            !wasSuccessful ? reject()
            : fs.unlink(file.path, (err) => {
                  err ? reject() : resolve();
              });
        });
    });
}

module.exports.uploadS3 = uploadS3;
