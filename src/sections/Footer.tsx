import texts from '../data/texts.json'
import partners from '../data/partners.json'

export default function Footer() {
  const organizerLogos = partners.organizers.filter((o) => o.placement.includes('footer'))

  return (
    <footer className="bg-primary text-white py-14">
      <div className="mx-auto max-w-7xl px-6 flex flex-col md:flex-row justify-between gap-10">
        <div>
          <img src="/assets/general/logo.svg" alt="Креативная среда" className="h-7 w-auto mb-4" />
          <p className="font-bold text-lg mb-4">{texts.footer.programName}</p>
          <div className="flex gap-4 mb-4 opacity-80">
            {organizerLogos.map((o) => (
              <img key={o.name} src={o.logo} alt={o.name} className="h-6 w-auto" />
            ))}
          </div>
          <p className=" text-white/60">{texts.footer.copyright}</p>
        </div>

        <div className=" text-white/70 space-y-2">
          <p>
            <a href="mailto:info@example.com" className="hover:text-white">
              info@example.com
            </a>
          </p>
          <p>Telegram / телефон — уточнить у клиента</p>
          <a href="/privacy" className="underline block">
            Политика обработки персональных данных
          </a>
        </div>
      </div>
    </footer>
  )
}
