"use client";
import { AlignJustify, Bell } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { motion } from "framer-motion";
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, x: 30 }, // 👈 Slide in from right
  visible: { opacity: 1, x: 0, transition: { duration: 0.5 } },
};

const HomePage = () => {
  return (
    <motion.section
      className="home-section h-screen min-h-screen flex flex-col bg-primary-custom overflow-x-hidden"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      {/* Top Bar */}
      <motion.div className="space-y-4 p-4" variants={itemVariants}>
        <motion.div
          className="flex items-center justify-between gap-3"
          variants={itemVariants}
        >
          <AlignJustify className="w-6 h-6 text-white cursor-pointer" />
          <h1 className="text-3xl font-semibold text-white">UAVAUTO</h1>
          <Bell className="w-6 h-6 text-white cursor-pointer" />
        </motion.div>

        {/* Drone Image */}
        <motion.div
          className="bg-blue-900 mx-auto relative rounded-lg w-64 h-36 sm:w-80 sm:h-40"
          variants={itemVariants}
        >
          <Image
            src="/Images/dashboard_drone.png"
            alt="Sample Image"
            fill
            className="object-contain"
          />
        </motion.div>
      </motion.div>

      {/* Menu Pages */}
      <motion.div
        className="menu-pages flex-1 w-full bg-white rounded-tl-[2rem] rounded-tr-[2rem] px-4 py-6 flex flex-col justify-center"
        variants={itemVariants}
      >
        <motion.div
          className="sm:w-[50%] grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 md:mx-auto"
          variants={containerVariants}
        >
          {items.map((item, index) => (
            <motion.div key={index} variants={itemVariants}>
              <Link
                href={item.href}
                className="rounded-lg shadow-xl border h-32 flex flex-col items-center justify-center p-3 space-y-3 cursor-pointer hover:bg-blue-500/5 transition-all duration-300"
              >
                <div className="relative h-full w-full">
                  <Image
                    src={item.imageSrc}
                    alt={item.label}
                    fill
                    className="mb-2 object-contain"
                  />
                </div>
                <p className="text-sm font-medium">{item.label}</p>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>
    </motion.section>
  );
};

const items = [
  {
    label: "Add Drone",
    imageSrc: "/Images/Add_Drone.png",
    href: "/drone/AddDrone",
  },
  {
    label: "View Drones",
    imageSrc: "/Images/View_Drone.png",
    href: "/drone/ViewDrone",
  },
  {
    label: "Geofencing",
    imageSrc: "/Images/Add_Routes.png",
    href: "/geofence/AddGeofence",
  },
  {
    label: "View Geofence",
    imageSrc: "/Images/View_Routes.png",
    href: "/geofence/ViewGeofence",
  },
  {
    label: "Plan Mission",
    imageSrc: "/Images/Plan_Mission.png",
    href: "/missionPlan/AddMissionPlan",
  },
  {
    label: "View Missions",
    imageSrc: "/Images/View_Mssions.png",
    href: "/missionPlan/ViewMissionPlan",
  },
  { label: "History", imageSrc: "/Images/History.png", href: "/history" },
];

export default HomePage;
