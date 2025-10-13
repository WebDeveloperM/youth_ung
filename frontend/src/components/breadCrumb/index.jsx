import {
	Breadcrumb,
	BreadcrumbItem,
	BreadcrumbLink,
	BreadcrumbList,
	BreadcrumbPage,
	BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'
import { FaHome } from 'react-icons/fa'
import { Link, useLocation } from 'react-router-dom'

const BreadcrumbComp = () => {
	const location = useLocation()
	const pathnames = location.pathname.split('/').filter(x => x)

	return (
		<div className='container mx-auto py-10 px-4'>
			<div className='bg-white/70 dark:bg-gray-900/50 border border-gray-200/40 dark:border-gray-800/50 rounded-2xl px-5 py-3 shadow-sm'>
				<Breadcrumb>
					<BreadcrumbList className='flex items-center space-x-2 text-sm'>
						<BreadcrumbItem>
							<BreadcrumbLink asChild>
								<Link
									to='/'
									className='flex items-center gap-2 text-[#0098C7] hover:text-[#0078A1] transition-colors duration-200'
								>
									<FaHome className='text-base' />
									<span className='font-medium'>Home</span>
								</Link>
							</BreadcrumbLink>
						</BreadcrumbItem>

						{pathnames.map((name, index) => {
							const routeTo = '/' + pathnames.slice(0, index + 1).join('/')
							const isLast = index === pathnames.length - 1
							const displayName =
								name.charAt(0).toUpperCase() + name.slice(1).replace(/-/g, ' ')

							return (
								<div key={name} className='flex items-center'>
									<BreadcrumbSeparator className='text-gray-400 px-2'>
										/
									</BreadcrumbSeparator>
									<BreadcrumbItem>
										{isLast ? (
											<BreadcrumbPage className='text-gray-800 dark:text-gray-200 font-semibold'>
												{displayName}
											</BreadcrumbPage>
										) : (
											<BreadcrumbLink asChild>
												<Link
													to={routeTo}
													className='text-gray-600 dark:text-gray-400 hover:text-[#0098C7] transition-colors duration-200'
												>
													{displayName}
												</Link>
											</BreadcrumbLink>
										)}
									</BreadcrumbItem>
								</div>
							)
						})}
					</BreadcrumbList>
				</Breadcrumb>
			</div>
		</div>
	)
}

export default BreadcrumbComp
