import { BrowserRouter as Router } from 'react-router-dom'
import "./index.css"
import { AppContent } from './AppContent';

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
