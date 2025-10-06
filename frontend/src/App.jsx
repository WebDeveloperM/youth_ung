import React from 'react';
import { LanguageProvider } from './contexts/LanguageContext';
import Auth from './components/Auth/Auth';

const App = () => {
	return (
		<LanguageProvider>
			<Auth />
		</LanguageProvider>
	);
};

export default App;
