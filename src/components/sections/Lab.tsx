import LoadLab from '../lab/LoadLab';
import Lens from '../ui/Lens';
import SectionHeading from '../ui/SectionHeading';

export default function Lab() {
  return (
    <section id="lab" className="section-y" aria-labelledby="lab-title">
      <div className="container-x">
        <SectionHeading
          id="lab-title"
          eyebrow="03 — Load Lab"
          title="Try to break it."
          intro={
            <Lens
              dev="Turn up the traffic and send a burst at the server until it falls over. Then put a queue in front of it, the way I rebuilt ticket intake at Clear Wave, and try again."
              plain="Send a crowd of visitors at a server until it falls over. Then add a waiting line in front of it, like the one I built at Clear Wave, and watch it cope."
            />
          }
        />
        <LoadLab />
        <p className="mt-4 max-w-3xl text-xs leading-relaxed text-muted sm:text-sm" data-reveal="fade">
          <Lens
            dev="An illustration, not a benchmark. In production, ticket intake failed at 50 requests per second when every request hit the app directly; rebuilt around RabbitMQ, it handles bursts of 16,000 requests per second."
            plain="An illustration, not a benchmark. In real life, the support-ticket system crashed at 50 requests a second; with a queue in front of it, it now copes with bursts of 16,000 a second."
          />
        </p>
      </div>
    </section>
  );
}
