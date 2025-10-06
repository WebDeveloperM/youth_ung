<<<<<<< HEAD
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
=======
import { Header } from './components/header'
function App() {
	return (
		<section>
			<Header />
		</section>
	)
}
>>>>>>> d82611239d5d2a08f23b09dd2822ef59a863e509

export default App;
