import { PublicDomainPlaceholder } from '@/components/states/public-domain-placeholder'
export default async function ResearchPage({ params }: { params: Promise<{ slug: string }> }) { const { slug } = await params; return <PublicDomainPlaceholder kind="Research" slug={slug} /> }
