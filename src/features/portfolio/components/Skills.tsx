import SkillCard from "./Skills/SkillCard"

interface Skill {
  name: string
  percentage: number
}

const skills: Skill[] = [
  { name: "Python Programming", percentage: 100 },
  { name: "Snowflake", percentage: 80 },
  { name: "dbt", percentage: 90 },
  { name: "Data Modelling (SQL)", percentage: 95 },
]

const Skills = () => {
  return (
    <section className="min-h-vh bg-background py-20">
      <div className="mx-auto max-w-6xl px-4">
        <div className="mb-16 text-center">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground text-balance mb-4">My Skillset</h2>
          <p className="text-lg md:text-xl text-muted-foreground text-pretty leading-relaxed">
            Including, but not limited to
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12">
          {skills.map((skill) => (
            <SkillCard key={skill.name} name={skill.name} percentage={skill.percentage} />
          ))}
        </div>
      </div>
    </section>
  )
}

export default Skills
