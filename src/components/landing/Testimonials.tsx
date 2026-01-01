"use client";

import React, { useEffect, useState } from "react";
import {
  motion,
  useMotionValue,
  useAnimation,
  useTransform,
  PanInfo,
  ResolvedValues,
} from "motion/react";

const testimonials = [
  {
    text: "TaxiFlow transformed our operations completely. We increased our fleet efficiency by 40% and customer satisfaction scores are at an all-time high.",
    author: "Maria Rodriguez",
    role: "Fleet Manager",
    company: "Metro Taxi",
    location: "New York",
    rating: 5,
  },
  {
    text: "The dashboard gives us complete visibility into our business. Real-time tracking and automated reporting saved us countless hours every week.",
    author: "James Chen",
    role: "Operations Director",
    company: "City Cabs",
    location: "San Francisco",
    rating: 5,
  },
  {
    text: "Outstanding platform! Easy to use, powerful features, and excellent customer support. Our drivers love the mobile app integration.",
    author: "Sarah Johnson",
    role: "CEO",
    company: "QuickRide Services",
    location: "Chicago",
    rating: 5,
  },
  {
    text: "We've tried multiple solutions before TaxiFlow. Nothing comes close to the comprehensive features and reliability we get here.",
    author: "Ahmed Hassan",
    role: "Business Owner",
    company: "Desert Rides",
    location: "Phoenix",
    rating: 5,
  },
  {
    text: "The analytics and reporting features are incredible. We can now make data-driven decisions that have significantly improved our service quality.",
    author: "Emily Carter",
    role: "Operations Manager",
    company: "Swift Transport",
    location: "Miami",
    rating: 5,
  },
  {
    text: "Customer support is top-notch. The onboarding process was smooth, and the team helped us migrate from our old system without any downtime.",
    author: "Robert Kim",
    role: "Fleet Coordinator",
    company: "Urban Rides",
    location: "Seattle",
    rating: 5,
  },
  {
    text: "Revenue increased by 35% in just 3 months. The platform pays for itself and then some. Best investment we've made for our taxi business.",
    author: "Lisa Wang",
    role: "Business Director",
    company: "Golden Gate Cabs",
    location: "San Francisco",
    rating: 5,
  },
  {
    text: "The mobile app for drivers is fantastic. Our drivers are more efficient, happier, and customers love the real-time tracking feature.",
    author: "David Thompson",
    role: "Fleet Manager",
    company: "Liberty Taxi",
    location: "Boston",
    rating: 5,
  },
];

interface RollingTestimonialsProps {
  autoplay?: boolean;
  pauseOnHover?: boolean;
}

const RollingTestimonials: React.FC<RollingTestimonialsProps> = ({
  autoplay = true,
  pauseOnHover = true,
}) => {
  const [isScreenSizeSm, setIsScreenSizeSm] = useState<boolean>(false);

  useEffect(() => {
    const handleResize = () => setIsScreenSizeSm(window.innerWidth <= 640);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Widen the ring (increases circumference and radius)
  const cylinderWidth: number = isScreenSizeSm ? 1600 : 2600;
  const faceCount: number = testimonials.length;

  // Reduce the per-face share of the circumference to create larger gaps
  // Tune 0.9 → 0.85 for even more spacing (cards stay same size)
  const faceWidth: number = (cylinderWidth / faceCount) * 0.9;

  // Radius derived from circumference
  const radius: number = cylinderWidth / (2 * Math.PI);

  // Interaction/animation
  const dragFactor: number = 0.05;
  const rotation = useMotionValue(0);
  const controls = useAnimation();

  const transform = useTransform(
    rotation,
    (val: number) => `rotate3d(0,1,0,${val}deg)`
  );

  const startInfiniteSpin = (startAngle: number) => {
    controls.start({
      rotateY: [startAngle, startAngle - 360],
      transition: {
        duration: 25,
        ease: "linear",
        repeat: Infinity,
      },
    });
  };

  useEffect(() => {
    if (autoplay) {
      const currentAngle = rotation.get();
      startInfiniteSpin(currentAngle);
    } else {
      controls.stop();
    }
  }, [autoplay, controls, rotation]);

  const handleUpdate = (latest: ResolvedValues) => {
    if (typeof latest.rotateY === "number") {
      rotation.set(latest.rotateY);
    }
  };

  const handleDrag = (
    _: MouseEvent | TouchEvent | PointerEvent,
    info: PanInfo
  ): void => {
    controls.stop();
    rotation.set(rotation.get() + info.offset.x * dragFactor);
  };

  const handleDragEnd = (
    _: MouseEvent | TouchEvent | PointerEvent,
    info: PanInfo
  ): void => {
    const finalAngle = rotation.get() + info.velocity.x * dragFactor;
    rotation.set(finalAngle);
    if (autoplay) {
      startInfiniteSpin(finalAngle);
    }
  };

  const handleMouseEnter = (): void => {
    if (autoplay && pauseOnHover) {
      controls.stop();
    }
  };

  const handleMouseLeave = (): void => {
    if (autoplay && pauseOnHover) {
      const currentAngle = rotation.get();
      startInfiniteSpin(currentAngle);
    }
  };

  return (
    <section
      className="py-20 px-0 min-h-screen flex items-center justify-center"
      id="testimonials"
      style={{
       backgroundColor: "rgb(15, 15, 15)"
      }}
    >
      <div className="w-full">
        {/* Header */}
        <div className="text-center mb-16 px-6">
          <h2
            className="text-4xl md:text-5xl font-bold mb-6 text-white"
            style={{
              fontFamily:
                'Archivo, "Archivo Fallback", system-ui, -apple-system, "Segoe UI", Roboto, Arial, sans-serif',
              letterSpacing: "-0.02em",
            }}
          >
            TRUSTED BY <span className="text-amber-500 italic">MANY</span>
          </h2>
          <p
            className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed"
            style={{
              fontFamily: 'aeonikFono, "aeonikFono Fallback", monospace',
            }}
          >
            Join hundreds of successful taxi businesses that have transformed
            their operations with TaxiWaala
          </p>
        </div>

        {/* Stats Bar */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-16 px-6 max-w-4xl mx-auto">
          {[
            { number: "500+", label: "Happy Customers" },
            { number: "50K+", label: "Rides Daily" },
            { number: "99.9%", label: "Uptime" },
            { number: "4.9/5", label: "Rating" },
          ].map((stat, index) => (
            <div key={index} className="text-center group">
              <div
                className="text-3xl md:text-4xl font-bold mb-2 transition-all duration-300 group-hover:scale-110"
                style={{
                  color: "#d97706",
                  textShadow: "0 2px 4px rgba(217, 119, 6, 0.3)",
                  fontFamily:
                    'Archivo, "Archivo Fallback", system-ui, -apple-system, "Segoe UI", Roboto, Arial, sans-serif',
                }}
              >
                {stat.number}
              </div>
              <div
                className="text-gray-400 text-sm font-medium"
                style={{
                  fontFamily: 'aeonikFono, "aeonikFono Fallback", monospace',
                }}
              >
                {stat.label}
              </div>
            </div>
          ))}
        </div>

        {/* Rolling Testimonials */}
        <div className="relative h-[400px] w-full overflow-hidden">
          {/* Wider gradient overlays for the wider ring */}
          <div
            className="absolute top-0 left-0 h-full w-[100px] z-10"
            style={{
              background:
                "linear-gradient(to left, rgba(15,15,15,0) 0%, #0f0f0f 100%)",
            }}
          />
          <div
            className="absolute top-0 right-0 h-full w-[100px] z-10"
            style={{
              background:
                "linear-gradient(to right, rgba(15,15,15,0) 0%, #0f0f0f 100%)",
            }}
          />

          <div className="flex h-full items-center justify-center [perspective:1200px] [transform-style:preserve-3d]">
            <motion.div
              drag="x"
              dragElastic={0}
              onDrag={handleDrag}
              onDragEnd={handleDragEnd}
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
              animate={controls}
              onUpdate={handleUpdate}
              style={{
                transform: transform,
                rotateY: rotation,
                width: cylinderWidth,
                transformStyle: "preserve-3d",
              }}
              className="flex min-h-[300px] cursor-grab items-center justify-center [transform-style:preserve-3d]"
            >
              {testimonials.map((testimonial, i) => (
                <div
                  key={i}
                  className="group absolute flex h-fit items-center justify-center p-[2.5%] [backface-visibility:hidden]"
                  style={{
                    width: `${faceWidth}px`,
                    transform: `rotateY(${(360 / faceCount) * i}deg) translateZ(${radius}px)`,
                  }}
                >
                  {/* Testimonial Card — original size preserved */}
                  <div
                    className=" pointer-events-none h-[280px] w-[320px] sm:h-[260px] sm:w-[280px] p-6 rounded-2xl transition-all duration-300 ease-out "
                    style={{
                      background: "linear-gradient(145deg, #1a1a1a, #0f0f0f)",
                      border: "1px solid #2a2a2a",
                      boxShadow:
                        "0 8px 32px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.1)",
                    }}
                  >
                    {/* Star Rating */}
                    <div className="flex items-center mb-4">
                      {[...Array(testimonial.rating)].map((_, starIndex) => (
                        <span
                          key={starIndex}
                          className="text-sm"
                          style={{
                            color: "#d97706",
                            filter:
                              "drop-shadow(0 1px 2px rgba(217, 119, 6, 0.3))",
                          }}
                        >
                          ⭐
                        </span>
                      ))}
                    </div>

                    {/* Testimonial Text */}
                    <p
                      className="text-gray-300 italic text-sm mb-4 leading-relaxed line-clamp-4"
                      style={{
                        fontFamily:
                          'aeonikFono, "aeonikFono Fallback", monospace',
                        fontSize: "13px",
                        lineHeight: "1.4",
                        display: "-webkit-box",
                        WebkitLineClamp: 4,
                        WebkitBoxOrient: "vertical",
                        overflow: "hidden",
                      }}
                    >
                      "{testimonial.text}"
                    </p>

                    {/* Author Info */}
                    <div
                      className="border-t pt-4"
                      style={{ borderColor: "#2a2a2a" }}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1 min-w-0">
                          <div
                            className="font-semibold text-sm truncate"
                            style={{
                              color: "#d97706",
                              fontFamily:
                                'Archivo, "Archivo Fallback", system-ui, -apple-system, "Segoe UI", Roboto, Arial, sans-serif',
                            }}
                          >
                            {testimonial.author}
                          </div>
                          <div
                            className="text-gray-400 text-xs mb-1 font-medium truncate"
                            style={{
                              fontFamily:
                                'aeonikFono, "aeonikFono Fallback", monospace',
                            }}
                          >
                            {testimonial.role}
                          </div>
                          <div
                            className="text-gray-500 text-xs truncate"
                            style={{
                              fontFamily:
                                'aeonikFono, "aeonikFono Fallback", monospace',
                            }}
                          >
                            {testimonial.company} • {testimonial.location}
                          </div>
                        </div>

                        {/* Verified Badge */}
                        <div
                          className="px-2 py-1 rounded-full text-xs font-medium ml-2 flex-shrink-0"
                          style={{
                            backgroundColor: "rgba(217, 119, 6, 0.1)",
                            color: "#d97706",
                            border:
                              "1px solid rgba(217, 119, 6, 0.3)",
                            fontFamily:
                              'aeonikFono, "aeonikFono Fallback", monospace',
                          }}
                        >
                          ✓
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default RollingTestimonials;
