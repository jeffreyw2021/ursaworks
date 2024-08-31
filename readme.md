
# Ursaworks Website Documentation

This website is for the Robomaster team at Washington University in St. Louis, and it's intended to be maintained by team members. Below, you'll find information on the project structure and instructions on how to add, edit, or remove content.

## Project Structure

1. **Main Code Folder**: The primary code for the website is located in the `react-ursaworks/src` directory. All references in this document pertain to files and folders within this directory.

2. **Assets Folder**: All images related to robots, events, and team members are stored in `react-ursaworks/src/assets`.

3. **Content JSON**: The website's content is managed through a JSON file located at `react-ursaworks/src/json/content.json`. When you need to change the website's content, this is the file you'll modify.

---

## Adding a New Robot

To add a new robot to the website, follow these steps:

1. **Upload the Robot's Image**: Place the image of the new robot in the `react-ursaworks/src/assets` folder.

2. **Update the JSON File**:
   - Open `react-ursaworks/src/json/content.json`.
   - Add a new object to the `"robots"` array. This object should include:
     - `"name"`: The name of the robot.
     - `"description"`: A description of the robot.
     - `"image"`: The file name of the robot's image as it appears in the `assets` folder (without the path).

   Example:
   ```json
   {
       "name": "newRobot",
       "description": "Description of the new robot's features and capabilities.",
       "image": "newRobotImage"
   }
   ```

3. **Sync and Preview**:
   - Run the command `npm run dev` to sync the new image to the public folder and start a local development server.
   - Preview the changes on `localhost` to ensure everything looks correct.

4. **Deploy Changes**:
   - If everything looks good, build the project with `npm run build`.
   - Deploy the changes using `npm run deploy`, which updates the `gh-pages` branch.
   - Finally, commit and push the changes to GitHub to update the repository.

---

## Editing a Robot's Information

1. **Locate the Robot Object**: In `content.json`, find the robot object you want to edit within the `"robots"` array.

2. **Update the Information**:
   - Change the `"name"`, `"description"`, or `"image"` as needed. 
   - Save the file.

3. **Sync, Preview, and Deploy**: Follow the same steps as outlined above to sync, preview, and deploy your changes.

---

## Deleting a Robot

1. **Find and Remove the Robot Object**: Locate the robot object in the `"robots"` array that you wish to delete and remove the entire object (the `{}` block containing the robot's details).

2. **Sync, Preview, and Deploy**: Follow the same steps as outlined above to sync, preview, and deploy your changes.

---

## Managing Events

### Adding a New Event

1. **Upload Event Image**: Place the event image in the `react-ursaworks/src/assets` folder.

2. **Update the JSON File**:
   - Open `react-ursaworks/src/json/content.json`.
   - Add a new object to the `"events"` array. This object should include:
     - `"name"`: The name of the event.
     - `"location"`: The location of the event.
     - `"date"`: The date of the event.
     - `"image"`: The file name of the event's image as it appears in the `assets` folder (without the path).

   Example:
   ```json
   {
       "name": "Sample Event",
       "location": "City, State",
       "date": "MMM DD, YYYY",
       "image": "eventImageName"
   }
   ```

3. **Sync, Preview, and Deploy**: Follow the steps as outlined above to sync, preview, and deploy your changes.

### Event Display Order

- The first two objects in the `"events"` array are considered top events and are displayed prominently on the website.
- The remaining events are shown as thumbnails.

### Editing or Deleting an Event

- **Editing**: Locate the event object in the `"events"` array you wish to edit and modify its details.
- **Deleting**: Remove the object of the event you want to delete from the `"events"` array.

---

## Managing Team Members

### Adding a New Member

1. **Upload Member Image**: Place the member's image in the `react-ursaworks/src/assets` folder.

2. **Update the JSON File**:
   - Open `react-ursaworks/src/json/content.json`.
   - Add a new object to the `"team"` array. This object should include:
     - `"name"`: The name of the team member.
     - `"position"`: The team member's position or role.
     - `"image"`: The file name of the member's image as it appears in the `assets` folder (without the path).

   Example:
   ```json
   {
       "name": "Jane Doe",
       "position": "Team Lead",
       "image": "janeDoeImage"
   }
   ```

3. **Sync, Preview, and Deploy**: Follow the steps as outlined above to sync, preview, and deploy your changes.

### Editing or Deleting a Member

- **Editing**: Locate the team member object in the `"team"` array you wish to edit and modify its details.
- **Deleting**: Remove the object of the team member you want to delete from the `"team"` array.

---

## Deploying the React Project to GitHub Pages

To deploy this React project to GitHub Pages, follow these steps:

1. **Prepare for Deployment**:
   - Ensure that your project is up-to-date and all changes are committed.
   - Make sure your `package.json` is already configured for deployment.
     - If it is not configured, you need to add a `homepage` field and set up `gh-pages`:
       - Open your `package.json` file.
       - Add the following line near the top: `"homepage": "https://<username>.github.io/<repo-name>"`
       - Install the `gh-pages` package by running: `npm install gh-pages --save-dev`
       - Add the following scripts to the `scripts` section in `package.json`:
         ```json
         "scripts": {
           "predeploy": "npm run build",
           "deploy": "gh-pages -d build"
         }
         ```
       Replace `<username>` with the GitHub username running the current GitHub Pages instance, and `<repo-name>` with the name of this repository.

2. **Build the Project**:
   - Run `npm run build` to create a production build of the project. This command will generate a `build` directory containing the optimized production files.

3. **Deploy to GitHub Pages**:
   - Run `npm run deploy`. This command will deploy the contents of the `build` directory to the `gh-pages` branch of your repository.
   - The website will be published under GitHub Pages, and you can view it using the GitHub Pages URL associated with your repository.

4. **Push Changes**:
   - After deploying, commit and push any changes to the `main` branch to keep the repository up-to-date.

By following these steps, you can ensure that the Ursaworks website is correctly deployed and accessible via GitHub Pages.

---

For any issues or questions, please refer to the project’s GitHub issues page or contact a project maintainer. Happy coding! 
