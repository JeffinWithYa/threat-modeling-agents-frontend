import * as z from "zod";

export const formSchema = z.object({
  prompt: z.string().min(1, {
    message: "Prompt is required."
  }),
  amount: z.string().min(1),
  topnode: z.string().nonempty("Top node is required."),
});

export const amountOptions = [
  {
    value: "User launches the app and logs in or registers via Amazon Cognito. Game assets required for play are fetched from Amazon S3. As the user plays, their game state (score, resources, etc.) is continuously updated in DynamoDB. Certain in-game events trigger AWS Lambda functions for processing. If users participate in multiplayer events, GameLift ensures seamless gameplay. Offline plays are synced back to DynamoDB using AppSync once the user is online. User behavior and game interactions are continuously sent to AWS Analytics for evaluation and insights. Amazon Pinpoint engages users with timely and relevant push notifications.",
    label: "Example 1: Game App"
  },
  {
    value: "The application architecture is a web application with a database. The web application is written in Python and uses the Flask framework. The database is a MySQL database. The web application is hosted on AWS EC2. The web application is a simple blog application that allows users to create posts and comment on posts. The web application uses a MySQL database to store the posts and comments. The web application uses the Flask framework to handle requests and responses. The web application uses the Jinja2 templating engine to render HTML templates. The web application uses the WTForms library to handle forms. The web application uses the Flask-Login library to handle user authentication. The web application uses the Flask-WTF library to handle forms. The web application uses the Flask-Bootstrap library to handle forms. The web application uses the Flask-Admin library to handle forms. The web application uses the Flask-RESTful library to handle forms.",
    label: "Example 2: Blog Website"
  }
];
