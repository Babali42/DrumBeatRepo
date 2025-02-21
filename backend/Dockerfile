# Use an official Scala image as the base image
FROM sbtscala/scala-sbt:graalvm-ce-22.3.3-b1-java17_1.10.1_3.4.2 AS builder

# Set the working directory inside the container
WORKDIR /app

ARG ENV=prod
ENV ENV=$ENV

# Copy the project files into the container
COPY . .

# Compile the application and create a distribution package
RUN sbt -D enableCoverage=false clean compile stage

# Use a lightweight JRE image for running the app
FROM openjdk:11-jre-slim

# Set the working directory inside the container
WORKDIR /app

# Copy the distribution package from the builder stage
COPY --from=builder /app/target/universal/stage /app

# Expose the port that your Play app listens on
EXPOSE 9000

# Set the entry point to start the Play application
ENTRYPOINT ["./bin/drum-beat-repo-backend"]