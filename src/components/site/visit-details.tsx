import { Clock, MapPin, MessageCircle, Phone, Share2 } from 'lucide-react'
import { directionsHref, telHref, whatsappHref } from '@/lib/site-config'
import { getSiteState } from '@/lib/server-data'
import { cn } from '@/lib/utils'
import { Placeholder } from './primitives'

function Row({ icon: Icon, label, children }: { icon: typeof Clock; label: string; children: React.ReactNode }) {
  return (
    <div className="grid grid-cols-[auto_1fr] gap-5 border-t border-current/15 py-6">
      <Icon className="mt-1 size-5 text-champagne" aria-hidden="true" />
      <div>
        <dt className="eyebrow text-[0.62rem] opacity-70">{label}</dt>
        <dd className="mt-2 text-base leading-relaxed">{children}</dd>
      </div>
    </div>
  )
}

const linkClass = 'underline decoration-champagne underline-offset-4 transition-colors hover:text-champagne'

export async function VisitDetails({ className }: { className?: string }) {
  const { site } = await getSiteState()
  const { address, phone, whatsapp } = site.contact
  const tel = telHref(phone)
  const wa = whatsappHref(whatsapp)
  const directions = directionsHref(site.contact)

  return (
    <dl className={cn('border-b border-current/15', className)}>
      <Row icon={MapPin} label="Address">
        {address ? <address className="not-italic">{address}</address> : <Placeholder>Verified street address</Placeholder>}
        <div className="mt-2">
          {directions ? (
            <a href={directions} target="_blank" rel="noreferrer" className={linkClass}>
              Get directions
            </a>
          ) : (
            <Placeholder className="text-sm">Map / directions link</Placeholder>
          )}
        </div>
      </Row>
      <Row icon={Phone} label="Phone">
        {phone && tel ? (
          <a href={tel} className={linkClass}>
            {phone}
          </a>
        ) : (
          <Placeholder>Verified phone number</Placeholder>
        )}
      </Row>
      <Row icon={MessageCircle} label="WhatsApp">
        {wa ? (
          <a href={wa} target="_blank" rel="noreferrer" className={linkClass}>
            Message us on WhatsApp
          </a>
        ) : (
          <Placeholder>WhatsApp number</Placeholder>
        )}
      </Row>
      <Row icon={Clock} label="Opening hours">
        {site.hours ? (
          <ul className="space-y-1">
            {site.hours.map((entry) => (
              <li key={entry.days} className="flex justify-between gap-6">
                <span>{entry.days}</span>
                <span>{entry.hours}</span>
              </li>
            ))}
          </ul>
        ) : (
          <Placeholder>Opening hours to be confirmed</Placeholder>
        )}
      </Row>
      <Row icon={Share2} label="Social">
        {site.social.length > 0 ? (
          <span className="flex flex-wrap gap-4">
            {site.social.map((social) => (
              <a key={social.href} href={social.href} target="_blank" rel="noreferrer" className={linkClass}>
                {social.label}
              </a>
            ))}
          </span>
        ) : (
          <Placeholder>Social media profiles</Placeholder>
        )}
      </Row>
    </dl>
  )
}
