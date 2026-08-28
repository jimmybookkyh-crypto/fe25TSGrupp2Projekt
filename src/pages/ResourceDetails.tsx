

export default function ResourceDetails() {
  return (
    <div>
      <h1>ResourceDetails</h1>
    </div>
  );
}

ResourceDetails.route = {
  path: "/Resources/:id",
  order: 3,
  label: "Rum detaljer",
};