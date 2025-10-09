import { useNavigate } from 'react-router-dom'
import { Button } from '../ui/button'
export function Useravatar() {
	const navigate = useNavigate()
	return (
		<div>
			{' '}
			<Button
				variant='outline'
				size='lg'
				className='text-md font-[500] text-blue-950 dark:text-white'
				onClick={() => navigate('/login')}
			>
				Kirish
			</Button>
		</div>
	)
}
