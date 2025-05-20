First create a folder - K-INSURE - in that, create a folder frontend - add these files using 'git clone https://github.com/avi098/K-INSURE-FRONTEND.git' and install using 'npm install' and install using npm with package.json

In K-INSURE - create a folder backend - add the file using 'git clone https://github.com/avi098/K-INSURE-BACKEND.git' and install using 'pip install -r requirements.txt'

'https://drive.google.com/drive/folders/1YWNF_8XuXd-Xp2wX7fSpQmVXLuEDQWdD?usp=drive_link' - go to this link and download 'churn_model.pkl' and 'best.pt' and place it in the backend folder

In cmd - go to backend - to run (python app.py)

In another cmd - go to frontend - to run (npm run start)


# K-Insure (Frontend): 

## About the Project
K-Insure is a full-stack web application developed as an internship project for an IT company, designed to provide insurance companies with tools for customer analytics, churn prediction, sentiment analysis, customer segmentation, and vehicle damage assessment. This README focuses on the **frontend** component, a React-based single-page application (SPA) that serves as the user interface for interacting with the K-Insure backend.

The frontend is built using React 18, Tailwind CSS, and a variety of modern UI libraries (e.g., Material-UI, Ant Design, Radix UI) to deliver a responsive and interactive experience. It integrates with the K-Insure backend (a Flask-based API) to display visualizations, manage user authentication, and provide features like customer dashboards, geographical insights, and vehicle damage assessment reports. Key features of the frontend include:

- **Responsive UI**: Built with Tailwind CSS, Material-UI, Ant Design, and Radix UI for a modern, user-friendly interface.
- **Data Visualizations**: Integration with Plotly.js, Chart.js, and Recharts to display EDA insights, sentiment analysis, and geographical data.
- **Interactive Components**: Uses Radix UI components (e.g., Accordion, Dialog, Dropdown Menu) and Framer Motion for animations.
- **Map Integration**: Leverages MapLibre GL and react-map-gl for geographical visualizations of customer data.
- **3D Visualizations**: Supports 3D rendering with Three.js and @react-three/fiber for potential advanced visualizations.
- **Authentication**: Integrates with Google OAuth for secure user login and supports backend API endpoints for signup/login.
- **File Uploads**: Handles PDF uploads for document review and image uploads for vehicle damage assessment.
- **Dynamic Routing**: Uses React Router for seamless navigation within the SPA.

The frontend communicates with the backend API (running on `http://localhost:5000`) to fetch data and perform actions. The backend provides endpoints for EDA, sentiment analysis, RFM analysis, churn prediction, customer dashboards, geographical insights, vehicle damage assessment, and document review.

## Prerequisites
To set up and run the K-Insure frontend, ensure you have the following installed:
- **Node.js** (version 16 or higher) and **npm** (version 8 or higher)
- **Git** (optional, for cloning the repository)
- **K-Insure Backend**: The Flask-based backend must be running (see backend setup instructions below).
- A modern web browser (e.g., Chrome, Firefox, Safari) for development and testing.

### Backend Prerequisites
The frontend relies on the K-Insure backend. Ensure the backend is set up with:
- Python 3.8 or higher
- PostgreSQL (version 12 or higher) with the `laster` table
- Roboto font files (`Roboto-Regular.ttf`, `Roboto-Bold.ttf`) for PDF generation
- YOLO model file (`best.pt`) for vehicle damage assessment
- A valid Gmail account with an App Password for email functionality
- Dependencies listed in `requirements.txt` (e.g., Flask, Pandas, Scikit-learn, Ultralytics, ReportLab)

Refer to the backend README for detailed setup instructions.

## Setup Instructions
1. **Clone or Download the Project**
   - Clone the frontend repository from your IT company’s internal system or the public release repository, or download the project files (`package.json`, `App.js`, `.env`, `postcss.config.js`, `tailwind.config.js`, and the `src/` folder).
   - Ensure the `src/` folder contains the `Home.js` component and other necessary files (e.g., components, styles).
   - Example command to clone:
     ```bash
     git clone <repository-url>
     cd frontend
     ```

2. **Install Dependencies**
   Navigate to the project directory and install the required npm packages listed in `package.json`:
   ```bash
   npm install
   ```
   The `package.json` includes:
   - **Dependencies**: React, React Router, Material-UI, Ant Design, Radix UI, Plotly.js, Chart.js, Recharts, MapLibre GL, Three.js, Framer Motion, Axios, and more.
   - **Dev Dependencies**: Tailwind CSS, PostCSS, Autoprefixer, and Babel plugins.

3. **Configure Environment Variables**
   - The provided `.env` file disables source map generation:
     ```
     GENERATE_SOURCEMAP=false
     ```
   - No additional `.env` variables are required for the frontend, but ensure the backend `.env` is configured with:
     ```
     SENDER_EMAIL=your_email@gmail.com
     SENDER_PASSWORD=your_gmail_app_password
     ```
   - If using Google OAuth or OpenAI API, add relevant keys to a `.env` file (e.g., `REACT_APP_GOOGLE_CLIENT_ID` for OAuth).

4. **Set Up Tailwind CSS**
   - The `tailwind.config.js` and `postcss.config.js` files configure Tailwind CSS with custom animations (e.g., fade-in, gradient-x).
   - Ensure the `content` paths in `tailwind.config.js` cover all your React components:
     ```javascript
     content: ["./src/**/*.{js,jsx,ts,tsx}"],
     ```
   - Verify that Tailwind CSS is imported in your main CSS file (e.g., `src/index.css`):
     ```css
     @tailwind base;
     @tailwind components;
     @tailwind utilities;
     ```

5. **Set Up the Backend**
   - Ensure the K-Insure backend is running on `http://localhost:5000`. Follow the backend setup instructions:
     - Install Python dependencies: `pip install -r requirements.txt`
     - Configure PostgreSQL with the `laster` table.
     - Place `best.pt`, `Roboto-Regular.ttf`, and `Roboto-Bold.ttf` in the backend directory.
     - Run the backend: `python app.py`
   - The frontend’s `package.json` includes a proxy setting to forward API requests to the backend:
     ```json
     "proxy": "http://localhost:5000"
     ```

6. **Directory Structure**
   Ensure the following structure in your frontend project directory:
   ```
   frontend/
   ├── public/
   │   └── index.html
   ├── src/
   │   ├── Home.js
   │   ├── App.js
   │   ├── index.js
   │   ├── index.css
   │   └── other components or assets
   ├── .env
   ├── package.json
   ├── postcss.config.js
   ├── tailwind.config.js
   └── node_modules/
   ```

## Running the Project
1. **Start the Development Server**
   Navigate to the project directory and run:
   ```bash
   npm start
   ```
   This starts the React development server, typically on `http://localhost:3000`. The `GENERATE_SOURCEMAP=false` setting reduces build size and improves performance.

2. **Access the Application**
   Open a web browser and navigate to `http://localhost:3000`. The default route (`/`) renders the `Home` component, which serves as the main interface for the K-Insure frontend.

3. **Using the Application**
   The frontend interacts with the backend API endpoints. Key functionalities include:
   - **User Authentication**: Sign up or log in via `/api/signup` and `/api/login`, or use Google OAuth if implemented.
   - **EDA Visualizations**: Fetch and display churn rate, GWP, and other insights from `/api/eda` using Plotly.js or Recharts.
   - **Sentiment Analysis**: Visualize sentiment distributions and word clouds from `/api/visualizations`.
   - **Customer Segmentation**: Display RFM analysis results from `/api/rfm-analysis`.
   - **Churn Prediction**: Submit data to `/api/predict` for churn risk and trigger model retraining via `/api/train`.
   - **Customer Dashboard**: View personalized customer data from `/api/customer-dashboard` with LOB and CPR_NO parameters.
   - **Geographical Insights**: Render maps with data from `/get_india_data` and `/get_region_churn_data` using MapLibre GL.
   - **Vehicle Damage Assessment**: Upload images to `/api/assess-damage` and generate PDF reports via `/api/generate-pdf`.
   - **Document Review**: Upload PDFs to `/api/review-pdf` for key information extraction and emailed reports.

   Ensure the backend is running to handle these API requests.

4. **Building for Production**
   To create a production-ready build, run:
   ```bash
   npm run build
   ```
   This generates a `build/` folder with optimized static files. Serve these files using a web server (e.g., `serve -s build`).

## Notes
- **Backend Dependency**: The frontend requires the K-Insure backend to be running on `http://localhost:5000`. Verify the proxy setting in `package.json` matches the backend URL.
- **API Integration**: Use Axios (included in dependencies) to make HTTP requests to the backend. Ensure CORS is enabled in the backend (`CORS(app, resources={r"/api/*": {"origins": "*"}})`).
- **Styling**: Tailwind CSS provides utility classes for styling, with custom animations defined in `tailwind.config.js`. Material-UI and Ant Design components are also available for complex UI elements.
- **Visualizations**: Plotly.js and Recharts are used for charts. Ensure data from the backend is formatted correctly for these libraries.
- **Map Rendering**: MapLibre GL requires a valid map style or tileset. Configure `react-map-gl` with appropriate map sources.
- **3D Features**: Three.js and @react-three/fiber are included but may require additional setup for specific 3D visualizations.
- **Google OAuth**: If using `@react-oauth/google`, configure the Google Client ID in the frontend `.env` file and set up the OAuth consent screen in Google Cloud Console.
- **Performance**: The `GENERATE_SOURCEMAP=false` setting reduces build size. For large datasets or visualizations, optimize component rendering with React memoization or lazy loading.

## Troubleshooting
- **Module Not Found Error**: Ensure all dependencies are installed with `npm install`. Check for version conflicts in `package.json`.
- **Backend Connection Issues**: Verify the backend is running on `http://localhost:5000` and the proxy setting is correct. Check for CORS errors in the browser console.
- **Styling Issues**: Ensure Tailwind CSS is properly imported in `index.css` and the `content` paths in `tailwind.config.js` include all component files.
- **Map Rendering Errors**: Confirm MapLibre GL is configured with a valid map style or API key (if required).
- **OAuth Errors**: Check the Google Client ID and ensure the redirect URI matches your frontend URL (e.g., `http://localhost:3000`).
- **Build Failures**: Run `npm run build` with `--loglevel=verbose` to diagnose issues. Ensure `GENERATE_SOURCEMAP=false` is set in `.env`.
- **Performance Issues**: For slow rendering, optimize heavy components (e.g., Plotly charts, 3D models) or reduce animation complexity in `tailwind.config.js`.

## License
This project was developed as part of an internship at KANINI Software Solutions India Private Limited. All rights are reserved by KANINI Software Solutions India Private Limited. The source code, documentation, and related assets are proprietary and primarily intended for internal use within KANINI Software Solutions India Private Limited or for educational purposes during the internship. The project has also been released for public use under the following conditions:

- **Public Use**: Public users may use, copy, and modify the source code for non-commercial, educational, or personal purposes only. Any commercial use, redistribution, or derivative works require prior written consent from KANINI Software Solutions India Private Limited.
- **Restrictions**: Unauthorized commercial use, distribution, or modification outside the scope of the internship or public non-commercial use is strictly prohibited without prior written consent from KANINI Software Solutions India Private Limited.
- **Attribution**: When using or sharing this project publicly for non-commercial purposes, please credit KANINI Software Solutions India Private Limited and the internship team.
- **Contact**: For inquiries regarding usage, permissions, or commercial licensing, contact KANINI Software Solutions India Private Limited’s project supervisor or legal department.

This license ensures that the project remains proprietary while allowing limited public access for educational and non-commercial use, as per the release terms.
