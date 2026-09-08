import { PublicDomainPlaceholder } from '@/components/states/public-domain-placeholder'
export default async function ProjectPage({ params }: { params: Promise<{ slug: string }> }) { const { slug } = await params; return <PublicDomainPlaceholder kind="Project" slug={slug} /> }
