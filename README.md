# Merkle Tree

This repository was specifically created for recruitment purposes. The solution presented here is not complete – I would like to discuss the details during the interview. The code contains an implementation of the logic to create and search a Merkle tree, as well as an API to handle it.

## How to Run

WIP! Currently configuring AWS and all its components. After testing the application, I will add a detailed description of how to launch the API.

## Code Structure

The repository consists of the following folders: `api`, `app`, `core`, and `storage`. This structure suggests a division of the code into npm packages, which I would apply in a full-fledged project. The goal is to improve scalability, reduce code duplication, and allow integration with various sources in the future.

- **core**: Contains basic elements and interfaces used in all the framework's modules.
  
- **app**: Focuses on the logic defined in this task, i.e., creating the tree and searching for nodes by index.

- **storage**: An example module with implementations of different data containers, such as DynamoDB, MongoDB, Redis, etc.

- **api**: Implementation of the API based on AWS API Gateway and lambdas.

This division allows for easy adaptation of the logic to different platforms, the use of various data containers, and scaling of the solution.

## Inversion of Control (IoC)

The application's code and database components rely on the Inversion of Control (IoC) mechanism, using the `inversify` library in this case. This makes it easy to manage components; simply initialize them in the container before launching the API.

## Clean Architecture

The code is based on the principles of `Clean Architecture`. While it may seem complicated in the presented example, it's a practical approach, especially when extending and scaling the code. This ensures mobility of logic that is not directly related to external tools and libraries.

- **Controller**: Serves as the starting point where methods are handlers for specific operations.

- **Use case**: Components where the main logic is executed.

- **Repository**: A facade for specific data sources.

- **Mapper**: Responsible for mapping objects.

- **Data source**: Wrapper for specific database clients.

- **Entity**: Objects used in logic.

- **Models/DTO**: TypeScript types.

## Database

Although I use MongoDB on a daily basis, I chose DynamoDB for this project due to its availability in the proposed AWS resources. An important aspect to consider in the final product is the implementation of a caching mechanism. Using tools like Redis or solutions available in AWS, such as Amazon ElastiCache, significantly improves application performance, especially when frequently accessing the same data.

## Challenges

- Implementing the Merkle tree was a new experience for me.

- Configuring the application in AWS is challenging, but also a valuable experience.

## Used Resources

- Merkle Tree: [Merkle Tree: A Beginners Guide](https://kba.ai/merkle-tree-a-beginners-guide/)
- [https://www.mermaidchart.com/app/projects/b780ec3a-82fd-4124-9aac-d9a3f92f0acc/diagrams/60cf4c6e-48f6-4d48-b83b-efcf38cbcb30/version/v0.1/view](Chart)
- AWS Documentation
- Experience drawn from my daily work

## ToDo

- Configure AWS.
- Test the code's operation.
- Add instructions for launching the application.
- Add an endpoint for tree removal.
- Add unit and API tests.
- Expand the API documentation e.g. Swagger.
- Implement monitoring, e.g., using Amazon CloudWatch.