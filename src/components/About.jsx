import Buddyavatar
 from "./Buddyavatar"

function About() {
  return (
    <section className="py-5"id="about">
      <div className="align-items-center row g-4">
        <div className="col-lg-4 text-center">
          <Buddyavatar mood="okay" size={160}></Buddyavatar>
        </div>
        <div className="col-lg-8">
         <h2 className="fw-bold mb-3">  About Your Health Companion </h2>
         <p className="text-secondary">Friendly health companion built for kids and families. It uses a simple transparent rule
          engine to turn symptoms and vitals into easy to understand tips and precautions-and can optionaly use Gemini AI to add 
          extra kid freindly explanations.

         </p>
         <ul className="text-secondary">
          <li>Health companion never replances the doctor</li>
          <li>Anything that looks serious always points to "tell a grown up right away"</li>
          <li>Your check-end history saved privately in this browser </li>
         </ul>
        </div>
        
      </div>
    </section>
  )
}

export default About