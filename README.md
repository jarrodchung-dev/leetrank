# LeetRank

## Docker 

Using multistage builds creates a temporary image used for generating static files, which are then copied over to the production image.

The temporary build image is discarded along with the original files and folders associated with the image. This produces a lighter, production-ready image.

Environment variables needed by an image are accessible via the ARG instruction. 

Passing in variables used by an image as environment variables (using `export` from the command-line), passing them in as build-time arguments 



## Docker Compose


## Docker Machine

