import {
	Breadcrumb,
	BreadcrumbItem,
	BreadcrumbLink,
	BreadcrumbList,
	BreadcrumbPage,
	BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'
import { useTranslation } from 'react-i18next'
import { FaHome } from 'react-icons/fa'
import { Link, useLocation } from 'react-router-dom'

const BreadcrumbComp = () => {
	const { t } = useTranslation()
	const location = useLocation()
	const pathnames = location.pathname.split('/').filter(x => x)

	return (
		<div className='container mx-auto py-10 px-4 mt-8 md:mt-12'>
			<div className='bg-white/70 dark:bg-gray-900/50  rounded-2xl px-5 py-3'>
				<Breadcrumb>
					<BreadcrumbList className='flex items-center space-x-2 text-sm'>
						<BreadcrumbItem>
							<BreadcrumbLink asChild>
								<Link
									to='/'
									className='flex items-center gap-2 text-[#0098C7] hover:text-[#0078A1] transition-colors duration-200'
								>
									<FaHome className='text-base' />
									<span className='font-medium'>{t('breadcrumb.home')}</span>
								</Link>
							</BreadcrumbLink>
						</BreadcrumbItem>

						{pathnames.map((name, index) => {
							const routeTo = '/' + pathnames.slice(0, index + 1).join('/')
							const isLast = index === pathnames.length - 1

							// Tarjima qilingan nomni olish yoki ID ni ko'rsatmaslik
							const translatedName = t(`breadcrumb.${name}`, name)
							const isNumeric = !isNaN(name)

							// Agar raqam bo'lsa (ID), uni ko'rsatmaymiz
							if (isNumeric) {
								return null
							}

							return (
								<div key={name} className='flex items-center'>
									<BreadcrumbSeparator className='text-gray-400 px-2'>
										<span className='pr-4'>/</span>
									</BreadcrumbSeparator>
									<BreadcrumbItem>
										{isLast ? (
											<BreadcrumbPage className='text-gray-800 dark:text-gray-200 font-semibold'>
												{translatedName}
											</BreadcrumbPage>
										) : (
											<BreadcrumbLink asChild>
												<Link
													to={routeTo}
													className='text-gray-600 dark:text-gray-400 hover:text-[#0098C7] transition-colors duration-200'
												>
													{translatedName}
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
