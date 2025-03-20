# Ursaworks Website Documentation

This website is for the Robomaster team at Washington University in St. Louis and is maintained by team members. Below, you'll find information on how to update the website's content, including robots, events, and team members.

---

## Project Structure
1. **Main Code Folder**: The primary code for the website is located in `react-ursaworks/src/`.
2. **Content Folder**: All content updates should be made in the `content/` directory, located outside the project folder. This folder contains:
   - `content/assets/` – Stores images for robots, events, and team members.
   - `content/content.json` – The key content management file for the entire project. The project references this file for arranging all text and images on the website.
3. **Automated Syncing**:  
   - When updates are made in the `content/` folder, running `npm start` or `npm run sync` will automatically:
     - Sync images from `content/assets/` to `src/assets/`.
     - Sync `src/assets/` to `public/assets/`.
     - Copy `content/content.json` into the project.

   > ⚠️ **Important**: Updates to images or `content.json` will not be effective unless you run the appropriate command lines (`npm start`, `npm run sync`, or `npm run dev`).

---

## Updating Website Content
### Adding a New Robot
1. **Upload the Robot's Image**:
   - Place the image in `content/assets/robots/`.
2. **Update the JSON File**:
   - Open `content/content.json` and add a new entry to the `"robots"` array:
   ```json
   {
       "name": "newRobot",
       "description": "Description of the new robot's features and capabilities.",
       "image": "newRobotImage.png"
   }
   ```
3. **Sync, Preview, and Deploy**:
   - Run `npm run dev` to sync and start the development server.
   - Preview changes on `localhost`.
   - Deploy updates with `npm run deploy`.

### Editing a Robot
1. Open `content/content.json`, locate the robot in `"robots"`, and edit as needed.
2. Run `npm run dev` to sync and preview.
3. Deploy if everything looks correct.

### Deleting a Robot
1. Remove the robot's entry from `"robots"` in `content/content.json`.
2. Delete its image from `content/assets/robots/`.
3. Run `npm run sync` to clean up the project files.

---

## Managing Events
### Adding a New Event
1. **Upload the Event Image**:
   - Place the image in `content/assets/events/`.
2. **Update the JSON File**:
   - Open `content/content.json` and add a new entry to `"events"`:
   ```json
   {
       "name": "Sample Event",
       "location": "City, State",
       "date": "MMM DD, YYYY",
       "image": "eventImage.png"
   }
   ```
3. **Sync, Preview, and Deploy**:
   - Run `npm run dev`, check `localhost`, then deploy.

### Editing or Deleting an Event
- **Editing**: Modify the event details in `content/content.json`.
- **Deleting**: Remove the event object and delete its image from `content/assets/events/`.

---

## Managing Team Members
### Adding a New Member
1. **Upload Member Image**:
   - Place the image in `content/assets/members/`.
2. **Update the JSON File**:
   - Open `content/content.json` and add a new entry to `"team"`:
   ```json
   {
       "name": "Jane Doe",
       "position": "Team Lead",
       "image": "janeDoeImage.png"
   }
   ```
3. **Sync, Preview, and Deploy**:
   - Run `npm run dev`, check `localhost`, then deploy.

### Editing or Deleting a Member
- **Editing**: Modify details in `content/content.json`.
- **Deleting**: Remove the entry and delete the image from `content/assets/members/`.

---

## Syncing Assets & Content
### Automatic Syncing
Whenever you start the project or deploy, the system automatically:
1. Syncs images from `content/assets/` to `src/assets/` (only about, robots, events, and members).
2. Syncs the entire `src/assets/` to `public/assets/`.
3. Copies `content/content.json` to the project.

### Manual Syncing
If changes are made in `content/`, manually sync by running:
```bash
npm run sync
```

---

## Deploying the Website
To deploy the website to GitHub Pages, follow these steps:

1. **Ensure content is updated**:
   - Modify `content/assets/` and `content/content.json` as needed.
   - Run `npm run sync` to update the project files.
2. **Build the project**:
   ```bash
   npm run build
   ```
3. **Deploy the project**:
   ```bash
   npm run deploy
   ```
4. **Push changes to GitHub** to keep everything updated.

---

## Important Notes
- Do **not** modify `src/assets/` manually. All assets should be updated in `content/assets/`.
- Do **not** edit `react-ursaworks/src/json/content.json` manually. Instead, modify `content/content.json`, which is the key content management file.
- Always run `npm run sync` after updating `content/` to ensure the website has the latest content.

---

For any issues, refer to the project's GitHub issues page or contact a maintainer.
