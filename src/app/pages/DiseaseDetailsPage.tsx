import { useNavigate, useLocation } from "react-router-dom";
import {
  ArrowLeft,
  Bug,
  Stethoscope,
  AlertCircle,
  Sprout,
  Tag,
} from "lucide-react";

export default function DiseaseDetailsPage() {
  const navigate = useNavigate();

  const { state } = useLocation();

  const disease = state?.disease || {
    name: "Leaf Spot",

    otherNames: "Leaf Spot Disease, Fungal Leaf Spots",

    type: "Fungal / Bacterial disease",

    symptoms: "Brown or black spots on leaves",

    description:
      "A common plant disease that causes spots and damage on leaves.",

    causes:
      "Caused by fungal or bacterial pathogens that thrive in humid, wet conditions.",

    treatment: {
      steps: [
        "Remove and destroy affected leaves",
        "Avoid overhead watering to keep foliage dry",
        "Apply a suitable fungicide or bactericide",
        "Improve air circulation around the plant",
      ],
    },

    imageUrl:
      "https://images.unsplash.com/photo-1592982537447-6f2a6a0d9b8f?w=600",
  };

  const treatmentSteps = disease.treatment?.steps ?? [];

  return (
    <div
      className="
min-h-screen
py-8
"
    >
      <button
        onClick={() => navigate(-1)}
        className="
mb-6
bg-white
p-3
rounded-full
shadow
hover:scale-105
transition
"
      >
        <ArrowLeft />
      </button>

      <div
        className="
max-w-7xl
mx-auto
bg-white
rounded-[40px]
shadow-xl
overflow-hidden
grid
lg:grid-cols-2
"
      >
        {/* LEFT SIDE */}

        <div
          className="
p-8
flex
flex-col
items-center
justify-center
text-black
"
        >
          <div
            className="
w-full
h-[500px]
rounded-3xl
overflow-hidden
shadow-2xl
"
          >
            {disease.imageUrl ? (
              <img
                src={disease.imageUrl}
                className="
w-full
h-full
object-cover
"
              />
            ) : (
              <div
                className="
w-full
h-full
flex
items-center
justify-center
bg-emerald-50
text-emerald-600
"
              >
                <Bug size={120} />
              </div>
            )}
          </div>

          <div
            className="
mt-8
text-center
"
          >
            <div
              className="
inline-flex
items-center
gap-2
bg-gray-100
px-4
py-2
rounded-full
"
            >
              {disease.type || "Plant Disease"}
            </div>

            <h1
              className="
text-5xl
font-bold
mt-5
"
            >
              {disease.name}
            </h1>

            <p
              className="
text-black
italic
text-xl
mt-3
"
            >
              {disease.otherNames}
            </p>
          </div>
        </div>

        {/* RIGHT SIDE */}

        <div
          className="
p-10
space-y-8
"
        >
          <section>
            <h2
              className="
text-3xl
font-bold
mb-5
"
            >
              Overview
            </h2>

            <div
              className="
grid
md:grid-cols-2
gap-4
"
            >
              {[
                ["Type", disease.type],
                ["Other Names", disease.otherNames],
              ].map((item) => (
                <div
                  key={item[0]}
                  className="
bg-emerald-50
rounded-2xl
p-5
"
                >
                  <p
                    className="
text-gray-500
text-sm
"
                  >
                    {item[0]}
                  </p>

                  <p
                    className="
font-bold
text-emerald-700
"
                  >
                    {item[1]}
                  </p>
                </div>
              ))}
            </div>
          </section>

          <div
            className="
border-t
"
          />

          <section>
            <h2
              className="
text-3xl
font-bold
mb-3
"
            >
              Description
            </h2>

            <p
              className="
text-gray-600
leading-8
text-lg
"
            >
              {disease.description}
            </p>
          </section>

          <section>
            <h2
              className="
text-3xl
font-bold
mb-3
"
            >
              Causes
            </h2>

            <p
              className="
text-gray-600
leading-8
text-lg
"
            >
              {disease.causes}
            </p>
          </section>

          <section>
            <h2
              className="
text-3xl
font-bold
mb-5
"
            >
              Diagnosis &amp; Treatment
            </h2>

            <div
              className="
grid
md:grid-cols-2
gap-5
"
            >
              <CareCard
                icon={<Stethoscope />}
                title="Symptoms"
                text={disease.symptoms}
              />

              <CareCard
                icon={<AlertCircle />}
                title="Causes"
                text={disease.causes}
              />

              <CareCard icon={<Tag />} title="Type" text={disease.type} />

              <CareCard
                icon={<Bug />}
                title="Other Names"
                text={disease.otherNames}
              />
            </div>
          </section>

          {treatmentSteps.length > 0 && (
            <section>
              <div
                className="
bg-gray-50
border
rounded-3xl
p-6
"
              >
                <div
                  className="
flex
items-center
gap-3
text-emerald-600
mb-4
"
                >
                  <Sprout />

                  <h2
                    className="
text-xl
font-bold
text-gray-900
"
                  >
                    Treatment Steps
                  </h2>
                </div>

                <ul
                  className="
space-y-3
"
                >
                  {treatmentSteps.map((step: string, index: number) => (
                    <li
                      key={index}
                      className="
flex
gap-3
text-gray-600
"
                    >
                      <span
                        className="
w-6
h-6
rounded-full
bg-emerald-100
text-emerald-700
flex
items-center
justify-center
text-sm
font-bold
shrink-0
"
                      >
                        {index + 1}
                      </span>

                      {step}
                    </li>
                  ))}
                </ul>
              </div>
            </section>
          )}
        </div>
      </div>
    </div>
  );
}

function CareCard({
  icon,

  title,

  text,
}: any) {
  return (
    <div
      className="
bg-gray-50
border
rounded-3xl
p-5
flex
gap-4
items-center
hover:shadow-lg
transition
"
    >
      <div
        className="
bg-emerald-100
text-emerald-700
p-4
rounded-2xl
"
      >
        {icon}
      </div>

      <div>
        <h3
          className="
font-bold
text-lg
"
        >
          {title}
        </h3>

        <p
          className="
text-gray-500
"
        >
          {text}
        </p>
      </div>
    </div>
  );
}
