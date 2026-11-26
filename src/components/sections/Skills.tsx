import SkillsIDE from '../skills/SkillsIDE';
import Lens from '../ui/Lens';
import SectionHeading from '../ui/SectionHeading';

export default function Skills() {
  return (
    <section id="skills" className="section-y" aria-labelledby="skills-title">
      <div className="container-x">
        <SectionHeading
          id="skills-title"
          eyebrow="04 — Skills"
          title="The stack, with receipts."
          intro={
            <Lens
              dev="Pick a file and a technology to see where I’ve actually used it. Every label is backed by real work."
              plain="Pick a category and a tool to see what it does in everyday words, and where I’ve used it."
            />
          }
        />
        <SkillsIDE />
      </div>
    </section>
  );
}
