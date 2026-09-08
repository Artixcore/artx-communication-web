import { PublicDomainPlaceholder } from '@/components/states/public-domain-placeholder'
export default async function UsWePage({ params }: { params: Promise<{ slug: string }> }) { const { slug } = await params; return <PublicDomainPlaceholder kind="UsWe" slug={slug} /> }
