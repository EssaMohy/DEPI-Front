import { useLocation, useNavigate } from "react-router-dom";
import { ArrowLeft, Bug, Stethoscope, AlertCircle, Sprout } from "lucide-react";

export default function DiseaseDetailsPage() {
  const location = useLocation();
  const navigate = useNavigate();

  const disease = location.state?.disease;

  if (!disease) {
    return (
      <div className="p-8 text-center">
        <h2 className="text-2xl font-bold">Disease not found</h2>

        <button
          onClick={() => navigate("/diseases")}
          className="
          mt-5
          px-5
          py-2
          rounded-xl
          bg-emerald-600
          text-white
          "
        >
          Back
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Back */}

      <button
        onClick={() => navigate(-1)}
        className="
        flex
        items-center
        gap-2
        text-emerald-700
        font-semibold
        "
      >
        <ArrowLeft size={20} />
        Back
      </button>

      {/* Hero */}

      <div
        className="
      bg-gradient-to-r
      from-emerald-600
      to-green-500
      rounded-3xl
      overflow-hidden
      text-white
      "
      >
        <div className="h-96">
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
            h-full
            flex
            items-center
            justify-center
            "
            >
              <Bug size={120} />
            </div>
          )}
        </div>

        <div className="p-8">
          <span
            className="
          bg-white/20
          px-4
          py-2
          rounded-full
          text-sm
          font-semibold
          "
          >
            {disease.type}
          </span>

          <h1
            className="
          text-4xl
          font-bold
          mt-5
          "
          >
            {disease.name}
          </h1>

          <p
            className="
          opacity-90
          mt-3
          text-lg
          "
          >
            {disease.description}
          </p>
        </div>
      </div>

      {/* Details */}

      <div
        className="
      grid
      md:grid-cols-2
      gap-6
      "
      >
        {/* Other Names */}

        <InfoCard
          icon={<Bug />}
          title="Other Names"
          content={disease.otherNames}
        />

        {/* Causes */}

        <InfoCard
          icon={<AlertCircle />}
          title="Causes"
          content={disease.causes}
        />

        {/* Symptoms */}

        <InfoCard
          icon={<Stethoscope />}
          title="Symptoms"
          content={disease.symptoms}
        />

        {/* Treatment */}

        <div
          className="
        bg-white
        rounded-3xl
        border
        shadow-sm
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
              Treatment
            </h2>
          </div>

          <ul
            className="
          space-y-3
          "
          >
            {(disease.treatment?.steps ?? []).map((step: string, index: number) => (
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
              "
                >
                  {index + 1}
                </span>

                {step}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

function InfoCard({
  icon,
  title,
  content,
}: {
  icon: any;
  title: string;
  content: string;
}) {
  return (
    <div
      className="
bg-white
rounded-3xl
border
shadow-sm
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
        {icon}

        <h2
          className="
text-xl
font-bold
text-gray-900
"
        >
          {title}
        </h2>
      </div>

      <p
        className="
text-gray-600
leading-relaxed
"
      >
        {content}
      </p>
    </div>
  );
}
