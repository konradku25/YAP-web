export default function Background({ isWork }) {
  return (
    <div className={`bg-canvas ${isWork ? 'bg-work' : 'bg-break'}`}>
      <div className="blob blob-1" />
      <div className="blob blob-2" />
      <div className="blob blob-3" />
      <div className="blob blob-4" />
      <div className="blob blob-5" />
      <div className="bg-noise" />
    </div>
  );
}
