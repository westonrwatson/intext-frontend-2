import { BrowserRouter as Router } from 'react-router-dom'
import "./index.css"
import { AppContent } from './AppContent';
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';

function App() {
    return (
        <>
            <Router>
                <AppContent />
            </Router>
        </>
    );
};

export default App
